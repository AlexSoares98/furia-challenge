// apps/kyf/src/steam.service.ts
import { Injectable } from '@nestjs/common';
import got from 'got';

interface SteamGamesResp {
  response: {
    games?: { playtime_forever: number }[];
  };
}

@Injectable()
export class SteamService {
  private key = process.env.STEAM_API_KEY as string;

  async getCs2Hours(steamId: string): Promise<number> {
    const url =
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${this.key}` +
      `&steamid=${steamId}&include_appinfo=0&appids_filter[0]=730`;

    const body = await got.get(url).json<SteamGamesResp>();

    const minutes = body.response.games?.[0]?.playtime_forever ?? 0;
    return Math.round(minutes / 60);
  }
}
