import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('No bearer token');

    const token = authHeader.slice(7);

    const sb = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
    );

    const {
      data: { user },
    } = await sb.auth.getUser(token);

    if (!user) throw new UnauthorizedException('Invalid token');

    req.user = user;
    return true;
  }
}
