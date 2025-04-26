import { Injectable, Inject } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SteamService } from './steam.service';
import { TwitterService } from './twitter.service';

interface ProfileRow {
  user_id: string;
  steam_id: string | null;
  twitter_id: string | null;
  cs2_hours: number;
  furia_follow: boolean;
  hashtag_likes: number;
}

@Injectable()
export class KyfService {
  constructor(
    @Inject('SUPABASE') private sb: SupabaseClient,
    private steam: SteamService,
    private tw: TwitterService,
  ) {}

  /** Atualiza e grava pontos + badge do usuário */
  async refreshProfile(userId: string): Promise<void> {
    const { data: prof } = await this.sb
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single<ProfileRow>();

    if (!prof) return; // não há perfil preenchido

    const hours = prof.steam_id
      ? await this.steam.getCs2Hours(prof.steam_id)
      : 0;
    const follows = prof.twitter_id
      ? await this.tw.followsFuria(prof.twitter_id)
      : false;
    const likes = prof.twitter_id
      ? await this.tw.hashtagLikes(prof.twitter_id)
      : 0;

    const fan_score =
      Math.min(hours / 100, 40) + (follows ? 30 : 0) + Math.min(likes * 3, 30);

    const badge =
      fan_score >= 90 ? 'Insano' : fan_score >= 60 ? 'Fanático' : 'Casual';

    await this.sb
      .from('profiles')
      .update({
        cs2_hours: hours,
        furia_follow: follows,
        hashtag_likes: likes,
      })
      .eq('user_id', userId);

    await this.sb.from('badges').upsert({
      user_id: userId,
      fan_score,
      badge,
    });
  }
}
