import { defineConfig } from 'orval'

export default defineConfig({
  sipe: {
    input: {
      target: 'schema.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints/api.ts',
      schemas: 'src/api/models',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        formData: {
          path: './src/api/mutator/form-data-mutator.ts',
          name: 'customFormData',
        },
      },
      biome: true,
    },
    hooks: {},
  },
})
