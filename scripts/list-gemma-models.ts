import 'dotenv/config';

async function listGemmaModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY não encontrada no .env');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`Erro ao chamar ListModels: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json() as { models: Array<{ name: string; supportedGenerationMethods: string[] }> };

  const gemma = data.models.filter(m =>
    m.name.toLowerCase().includes('gemma') &&
    m.supportedGenerationMethods.includes('generateContent')
  );

  if (gemma.length === 0) {
    console.log('Nenhum modelo Gemma com suporte a generateContent encontrado.');
    return;
  }

  console.log('Modelos Gemma disponíveis para generateContent:\n');
  gemma.forEach(m => console.log(' -', m.name.replace('models/', '')));
}

listGemmaModels();
