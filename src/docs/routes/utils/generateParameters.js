export function generateParameters(schema, baseRef = null, parentKey = '') {
  const params = [];
  const properties = schema.properties || {};

  // Define o baseRef dinamicamente, se não for fornecido
  const schemaRef = baseRef || '#/components/schemas/' + schema.title;

  for (const [key, value] of Object.entries(properties)) {
    // Se value estiver indefinido, pula para o próximo
    if (!value) continue;

    const paramName = parentKey ? `${parentKey}.${key}` : key;

    if (value.type === 'object' && value.properties) {
      params.push(...generateParameters(value, schemaRef, paramName));
    } else {
      params.push({
        name: paramName,
        in: 'query',
        required: false,
        schema: {
          $ref: `${schemaRef}/properties/${paramName}`
        },
        description: `Filtro por ${paramName}`
      });
    }
  }
  return params;
}