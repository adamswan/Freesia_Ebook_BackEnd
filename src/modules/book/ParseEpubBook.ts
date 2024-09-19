import * as fs from 'fs'
import * as path from 'path'
import * as fse from 'fs-extra'
import * as AdmZip from 'adm-zip'
import * as XmlJS from 'xml2js'

export class ParseEpubBook {
    constructor(
        private readonly bookPath: string,
        private readonly file: Express.Multer.File
    ) {
        // 
    }

    async toParse() {
        //! step 1. 把epub电子书复制一份，作为读写用的临时文件
        // 拷贝得到的文件的路径
        const targetPath = path.resolve('E:/Nginx/html/tempEpub', this.file.originalname)

        // 拷贝文件
        fse.copySync(this.bookPath, targetPath)

        //! step 2. 解压拷贝来的 .epub 文件，解压后的文件存在同名的文件夹中
        // 文件夹的名字
        const unzipEpubDirName = this.file.originalname.replace('.epub', '')
        // 生成装解压后的文件的路径
        const unzipEpubDirPath = path.resolve('E:/Nginx/html/tempEpub', unzipEpubDirName)
        // 根据名字创建文件夹
        fse.mkdirpSync(unzipEpubDirPath)
        // 解压成很多小文件
        this.toUnZip(targetPath, unzipEpubDirPath)

        //! step 3. 解析电子书的根文件 container.xml， 获取 content.opf 文件的路径
        const content_opf_file_path = await this.parseRootFile(unzipEpubDirPath)

        //! step 4. 解析电子书的 content.opf 文件, 得到电子书的关键信息
        const bookInfo_And_Content = await this.parsContentOpfFile(unzipEpubDirPath, content_opf_file_path)
        // console.log('书的信息和目录', bookInfo_And_Content)

        //! step 5. 解析完成，删除拷贝文件和解压文件
        fse.removeSync(targetPath)
        fse.removeSync(unzipEpubDirPath)

        return bookInfo_And_Content
    }

    // 解压电子书
    toUnZip(originEpubPath, unzipEpubDirPath) {
        const zip = new AdmZip(originEpubPath)
        // 解压到同名文件夹
        zip.extractAllTo(unzipEpubDirPath, true)
    }

    // 解析根文件 container.xml, 获取 content.opf 文件的路径
    parseRootFile(unzipEpubDirPath) {
        return new Promise((resolve) => {
            // 根文件路径
            const containerFilePath = path.resolve(unzipEpubDirPath, 'META-INF/container.xml')
            // 读取根文件
            const containerXml = fs.readFileSync(containerFilePath, 'utf-8')
            const { parseStringPromise } = XmlJS
            parseStringPromise(containerXml, { explicitArray: false })
                .then((data) => {
                    resolve(data.container.rootfiles.rootfile['$']['full-path'])
                })
        })
    }

    // 解析文件 content.opf, 获取电子书的关键信息
    parsContentOpfFile(unzipEpubDirPath, contentPath) {
        return new Promise((resolve) => {
            // content.opf 路径
            const fullPath = path.resolve(unzipEpubDirPath, contentPath)
            // 读取content.opf
            const contentOpf = fs.readFileSync(fullPath, 'utf-8')
            const { parseStringPromise } = XmlJS
            parseStringPromise(contentOpf, { explicitArray: false })
                .then(async (data) => {
                    const { metadata } = data.package
                    // 获取封面的地址
                    const coverMeta = metadata.meta.find(item => item['$'].name === 'cover')
                    const coverId = coverMeta['$'].content
                    const manifest = data.package.manifest.item
                    const coverRes = manifest.find(item => item['$'].id === coverId)
                    const dir = path.dirname(fullPath)
                    const coverImageAbsPath = path.resolve(dir, coverRes['$'].href)

                    // 解析目录
                    const contentRes = await this.parseContent(dir, 'toc.ncx', path.dirname(contentPath))

                    let bookInfo = {
                        title: metadata['dc:title'] || 'empty', // 书名
                        creator: metadata['dc:creator'] || 'empty', // 作者
                        language: metadata['dc:language'] || 'empty', // 语言
                        publisher: metadata['dc:publisher'] || 'empty', // 出版商
                        cover: coverImageAbsPath, // 封面图片
                        rootFile: fullPath //  content.opf文件的路径
                    }

                    resolve({
                        ...bookInfo,
                        contentRes
                    })
                })
        })
    }

    // 解析电子书目录
    parseContent(dir, contentFilePath, rootDir) {
        return new Promise((resolve) => {
            // 目录文件路径
            const contentPath = path.resolve(dir, contentFilePath)
            // 读取目录文件
            const contentXml = fs.readFileSync(contentPath, 'utf-8')
            //  转换为js文件
            const { parseStringPromise } = XmlJS
            parseStringPromise(contentXml, { explicitArray: false })
                .then((data) => {
                    const navMap = data.ncx.navMap.navPoint
                    const navData = navMap.map((nav) => {
                        const id = nav['$'].id
                        const playOrder = Number(nav['$'].playOrder)
                        const text = nav.navLabel.text
                        const href = nav.content['$'].src
                        return {
                            id,
                            playOrder,
                            text,
                            href: `${rootDir}/${href}`
                        }
                    })
                    resolve(navData)
                })

        })
    }
}