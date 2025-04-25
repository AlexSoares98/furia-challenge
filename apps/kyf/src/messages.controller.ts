import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { SupabaseGuard } from './auth.guard';
import type { SupabaseClient, User } from '@supabase/supabase-js';

interface ReqWithUser extends Request {
  user: User;
}

type MessageDTO = { text: string; role: 'user' | 'bot' };
type MessageRow = {
  id: string;
  user_id: string;
  text: string;
  role: 'user' | 'bot';
  created_at: string;
};

@UseGuards(SupabaseGuard)
@Controller('messages')
export class MessagesController {
  constructor(@Inject('SUPABASE') private readonly sb: SupabaseClient) {}

  /*  GET /messages  */
  @Get()
  async list(@Req() req: ReqWithUser): Promise<MessageRow[]> {
    const { data, error } = await this.sb
      .from('messages')
      .select('id,user_id,text,role,created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  /*POST /messages */
  @Post()
  async add(
    @Req() req: ReqWithUser,
    @Body() body: MessageDTO,
  ): Promise<MessageRow | null> {
    const { data, error } = await this.sb
      .from('messages')
      .insert(
        {
          user_id: req.user.id,
          text: body.text,
          role: body.role,
        },
        { count: 'exact' },
      )
      .select();
    if (error) throw error;
    return data ? (data as MessageRow[])[0] : null;
  }
}
