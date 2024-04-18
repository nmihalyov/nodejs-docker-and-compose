import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HideOwner implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) =>
            this.hideOwnerIfNotCurrentUser(item, currentUser),
          );
        } else {
          return this.hideOwnerIfNotCurrentUser(data, currentUser);
        }
      }),
    );
  }

  hideOwnerIfNotCurrentUser(offer, currentUser) {
    if (offer.user?.id !== currentUser.id && offer.hidden) {
      delete offer.user;
    }

    return offer;
  }
}
