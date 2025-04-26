import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { SupabaseGuard } from './auth.guard';
import { KyfService } from './kyf.service';
import type { SupabaseClient, User } from '@supabase/supabase-js';

interface BadgeRow {
  user_id: string;
  fan_score: number;
  badge: string;
  updated_at: string;
}

@UseGuards(SupabaseGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private kyf: KyfService,
    @Inject('SUPABASE') private sb: SupabaseClient,
  ) {}

  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: Request & { user?: User }) {
    if (!req.user || id !== req.user.id) throw new ForbiddenException();

    await this.kyf.refreshProfile(id);

    const { data } = await this.sb
      .from('badges')
      .select('*')
      .eq('user_id', id)
      .single<BadgeRow>();

    return data ?? {};
  }
}
