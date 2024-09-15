import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { ReqObj } from 'src/types/formatt';

@Injectable()
export class FormattInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //! 参数 data 就是每个服务的 return 值，他们被这个响应拦截器包装成标准格式

    // 使用 map 操作符包装数据
    const doMap = map((data: ReqObj) => {
      const theCode = data.code || 0; // 默认值为 0
      const theMessage = data.message || '成功'; // 默认值为 '成功'
      return {
        code: theCode,
        result: data.result,
        message: theMessage
      }
    })
    return next.handle().pipe(doMap);
  }
}
