import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesController } from './messages.controller';
import { SteamService } from './steam.service';
import { TwitterService } from './twitter.service';
import { KyfService } from './kyf.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env'],
    }),
    SupabaseModule,
  ],
  controllers: [AppController, MessagesController, ProfileController],
  providers: [AppService, SteamService, TwitterService, KyfService],
})
export class AppModule {}
