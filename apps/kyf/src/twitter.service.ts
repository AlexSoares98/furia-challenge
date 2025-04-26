import { Injectable } from '@nestjs/common';
import got from 'got';

interface FollowResp {
  data?: { id: string }[];
}
interface LikeResp {
  data?: { entities?: { hashtags?: { tag: string }[] } }[];
}

@Injectable()
export class TwitterService {
  private bearer = process.env.TW_BEARER as string;

  async followsFuria(twitterId: string): Promise<boolean> {
    const url = `https://api.twitter.com/2/users/${twitterId}/following`;

    const body = (await got
      .get(url, {
        headers: { authorization: `Bearer ${this.bearer}` },
        searchParams: { max_results: 1000 },
      })
      .json()) as FollowResp;  // 👈

    return body.data?.some((u) => u.id === '166911605') ?? false;
  }

  async hashtagLikes(twitterId: string): Promise<number> {
    const url = `https://api.twitter.com/2/users/${twitterId}/liked_tweets`;

    const body = (await got
      .get(url, {
        headers: { authorization: `Bearer ${this.bearer}` },
        searchParams: { max_results: 100 },
      })
      .json()) as LikeResp;  // 👈

    return (
      body.data?.filter((t) =>
        t.entities?.hashtags?.some(
          (h) => h.tag.toLowerCase() === 'gofuria',
        ),
      ).length ?? 0
    );
  }
}
