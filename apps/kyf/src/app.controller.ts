import { Controller, Get, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Controller()
export class AppController {
  constructor(@Inject('SUPABASE') private readonly sb: SupabaseClient) {}

  @Get('faq')
  async getFaq() {
    const { data } = await this.sb.from('faq').select('question,answer');
    return data;
  }
}
