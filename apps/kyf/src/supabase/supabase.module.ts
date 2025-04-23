import { Global, Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE',
      useFactory: () =>
        createClient(
          getEnvVar('SUPABASE_URL'),
          getEnvVar('SUPABASE_SERVICE_ROLE'),
        ),
    },
  ],
  exports: ['SUPABASE'],
})
export class SupabaseModule {}
