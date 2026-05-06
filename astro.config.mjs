import { defineConfig } from 'astro/config';
import cloudcannonEditableRegions from '@cloudcannon/editable-regions/astro-integration';

// https://astro.build/config
export default defineConfig({
  site: 'https://archicircle.test',
  integrations: [cloudcannonEditableRegions()],
});
