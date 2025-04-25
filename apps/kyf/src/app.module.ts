import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env'],
    }),
    SupabaseModule,
  ],
  controllers: [AppController, MessagesController],
  providers: [AppService],
})
export class AppModule {}
