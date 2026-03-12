import OpenAI from 'openai'
import { config } from '../config/index.js'

const openai = new OpenAI({
  apiKey: config.openai.apiKey
})

export const openaiService = {
  async generateRecommendations (storeData) {
    const prompt = buildPrompt(storeData)

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en ecommerce y marketing digital. Analizas datos de tiendas online y generas recomendaciones accionables para aumentar ventas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0].message.content
  }
}

function buildPrompt (storeData) {
  const { products, orders, productViews } = storeData

  return `
Analiza los siguientes datos de la tienda y genera recomendaciones accionables:

## Productos
${JSON.stringify(products, null, 2)}

## Pedidos recientes
${JSON.stringify(orders, null, 2)}

## Vistas de productos (tracking propio)
${JSON.stringify(productViews, null, 2)}

Por favor proporciona:
1. Análisis de productos con mejor y peor rendimiento
2. Identificación de oportunidades de mejora
3. Recomendaciones específicas y accionables
4. Priorización de acciones sugeridas

Formatea la respuesta como un JSON con el siguiente estructura:
{
  "analisis": "...",
  "recomendaciones": [
    {
      "titulo": "...",
      "descripcion": "...",
      "prioridad": "alta|media|baja",
      "impacto_estimado": "..."
    }
  ]
}
`
}
