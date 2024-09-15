import { SetMetadata } from '@nestjs/common';

// 自定义的路由元数据
export const IS_PUBLIC_KEY = 'isPublic';

// 用 SetMetadata() 创建自定义装饰器
export const Public = () => {
    return SetMetadata(IS_PUBLIC_KEY, true);
}