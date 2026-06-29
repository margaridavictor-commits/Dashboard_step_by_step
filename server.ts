import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Using fallback proposal generator.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Industry Fallbacks
const INDUSTRY_FALLBACKS: Record<string, any> = {
  vendas: {
    fields: [
      { name: "id_venda", type: "VARCHAR(50)", description: "Identificador único da transação de venda", required: true, sample: "VND-2026-9871" },
      { name: "data_venda", type: "TIMESTAMP", description: "Data e hora exata da transação", required: true, sample: "2026-06-29 14:32:00" },
      { name: "valor_total", type: "DECIMAL(10,2)", description: "Valor final faturado após impostos e descontos", required: true, sample: "24500.00 MT" },
      { name: "cliente_categoria", type: "VARCHAR(30)", description: "Segmento do cliente (B2B, B2C, VIP)", required: false, sample: "Corporativo" },
      { name: "regiao_venda", type: "VARCHAR(50)", description: "Província ou região moçambicana da venda", required: true, sample: "Maputo Cidade" }
    ],
    recommendedCharts: [
      { chartType: "Gráfico de Área (Evolução Temporal)", description: "Faturação Acumulada Mensal", rationale: "Permite à administração identificar tendências de crescimento, sazonalidade e picos de vendas ao longo dos trimestres." },
      { chartType: "Gráfico de Barras Horizontal", description: "Vendas por Categoria de Produto", rationale: "Facilita a comparação direta do desempenho dos diferentes segmentos de catálogo para ajuste de inventário." },
      { chartType: "Gráfico de Rosca (Donut Chart)", description: "Distribuição Regional de Receita", rationale: "Excelente para visualizar a representação de cada província no volume total de negócios da empresa." }
    ],
    securityLevels: [
      { role: "Administrador Geral", accessType: "Leitura e Escrita Total", scope: "Acesso total a todas as transações, margens financeiras e dados de clientes sem restrições." },
      { role: "Gestor Regional", accessType: "Leitura Restrita por Região", scope: "Apenas visualiza dados e KPIs da sua província correspondente (ex: apenas Sofala)." },
      { role: "Analista de Vendas", accessType: "Leitura Geral (Ocultar Margens)", scope: "Visualiza volumes de vendas, mas as margens de lucro reais e custos de aquisição estão mascarados." }
    ],
    implementationTimeline: [
      { phase: "Fase 1: Alinhamento & Mapeamento", duration: "1 Semana", deliverables: ["Dicionário de dados aprovado", "Arquitetura técnica validada", "Acesso aos repositórios de dados"] },
      { phase: "Fase 2: Engenharia de Dados & ETL", duration: "2 Semanas", deliverables: ["Pipelines de dados ativos", "Cargas de teste limpas", "Base de dados relacional configurada"] },
      { phase: "Fase 3: Design de Dashboards", duration: "1.5 Semanas", deliverables: ["Mockups de alta fidelidade", "Estrutura visual interativa aprovada", "Definição de paletes de cores"] },
      { phase: "Fase 4: Testes & Segurança (QA)", duration: "1 Semana", deliverables: ["Políticas de Row-Level Security ativas", "Testes de carga e performance", "Validação de dados com utilizadores"] },
      { phase: "Fase 5: Lançamento & Formação", duration: "0.5 Semana", deliverables: ["Dashboard em produção", "Documentação técnica entregue", "Sessão de formação para equipas"] }
    ],
    estimatedResources: "1 Engenheiro de Dados Sénior (50% alocação), 1 Especialista em BI/Analista (100% alocação), 1 Gestor de Projeto Data4Moz (20% alocação)."
  },
  logistica: {
    fields: [
      { name: "id_remessa", type: "VARCHAR(40)", description: "Identificador único do envio", required: true, sample: "REM-MAP-BEI-002" },
      { name: "data_despacho", type: "TIMESTAMP", description: "Data de saída do armazém", required: true, sample: "2026-06-29 08:00:00" },
      { name: "tempo_entrega_horas", type: "INT", description: "Tempo de trânsito efetivo em horas", required: true, sample: "18" },
      { name: "status_remessa", type: "VARCHAR(20)", description: "Estado atual (Entregue, Em Trânsito, Atrasado)", required: true, sample: "Entregue" },
      { name: "custo_combustivel", type: "DECIMAL(8,2)", description: "Custo estimado de combustível para a rota", required: false, sample: "12400.00 MT" }
    ],
    recommendedCharts: [
      { chartType: "Gráfico de Barras Agrupado", description: "Remessas Entregues no Prazo vs Atrasadas", rationale: "Visualização rápida da eficácia operacional diária ou semanal para identificar gargalos de distribuição." },
      { chartType: "Gráfico de Linhas Duplo", description: "Evolução do Custo por KM e Tempo de Trânsito", rationale: "Ajuda a monitorizar a eficiência de custos em relação à velocidade de serviço prestado ao cliente final." },
      { chartType: "Indicadores Rápidos (KPI Cards)", description: "Percentagem Geral de Cumprimento de Prazo (SLA)", rationale: "Visualização prioritária e de alto impacto no topo do painel operacional." }
    ],
    securityLevels: [
      { role: "Diretor de Operações", accessType: "Leitura Total", scope: "Acesso a métricas consolidadas nacionais, custos de frotas, contratos e performance de motoristas." },
      { role: "Supervisor de Armazém", accessType: "Leitura/Escrita Operacional", scope: "Visualiza e edita dados apenas do seu armazém local (ex: Armazém da Beira)." },
      { role: "Parceiro de Transporte / Terceiro", accessType: "Leitura Restrita (Sem Custos)", scope: "Apenas visualiza prazos e volumes de entrega que lhe estão atribuídos, sem acesso a dados de custos internos." }
    ],
    implementationTimeline: [
      { phase: "Fase 1: Mapeamento de Rotas & APIs", duration: "1 Semana", deliverables: ["Levantamento de fontes de dados GPS/ERP", "Definição de métricas de SLA", "Acessos garantidos"] },
      { phase: "Fase 2: Integração de Fontes", duration: "2 Semanas", deliverables: ["Conexão automatizada com ERP/GPS", "Normalização de datas e fusos horários", "Base de dados logística construída"] },
      { phase: "Fase 3: Construção dos Painéis", duration: "2 Semanas", deliverables: ["Painéis operacionais e táticos desenhados", "Filtros interativos implementados", "Ajuste mobile"] },
      { phase: "Fase 4: Validação de Regras de Negócio", duration: "1 Semana", deliverables: ["Ajuste fino de SLAs", "Testes de consistência dos dados históricos", "Permissões de utilizadores configuradas"] },
      { phase: "Fase 5: Entrada em Produção", duration: "0.5 Semana", deliverables: ["Implementação segura no servidor do cliente", "Vídeos curtos de formação", "Início de suporte 8/5"] }
    ],
    estimatedResources: "1 Engenheiro de Dados Sénior (40%), 1 Especialista Front-end (60%), 1 Especialista BI (80%), 1 Arquiteto de Cloud (20%)."
  },
  saude: {
    fields: [
      { name: "id_consulta", type: "VARCHAR(50)", description: "Identificador único do atendimento", required: true, sample: "CONS-4301" },
      { name: "tempo_espera_minutos", type: "INT", description: "Minutos decorridos entre triagem e atendimento", required: true, sample: "45" },
      { name: "especialidade", type: "VARCHAR(50)", description: "Especialidade médica do atendimento", required: true, sample: "Pediatria" },
      { name: "idade_paciente", type: "INT", description: "Idade em anos para análise demográfica", required: false, sample: "6" },
      { name: "satisfacao_score", type: "INT", description: "Avaliação do paciente (1 a 5)", required: false, sample: "5" }
    ],
    recommendedCharts: [
      { chartType: "Gráfico de Barras Empilhado", description: "Tempos Médios de Espera por Especialidade", rationale: "Crucial para realocar equipas médicas nas especialidades com maior tempo de retenção de utentes." },
      { chartType: "Gráfico de Linhas Contínuo", description: "Taxa de Ocupação de Leitos / Salas por Hora", rationale: "Permite detetar horários de pico e otimizar escalas de médicos e enfermeiras auxiliares." },
      { chartType: "Matriz de Satisfação (Heatmap)", description: "Evolução do Índice de Satisfação por Médico/Serviço", rationale: "Permite correlacionar o tempo de espera com o grau de satisfação final reportado pelo paciente." }
    ],
    securityLevels: [
      { role: "Diretor Clínico", accessType: "Acesso Geral Anonimizado", scope: "Métricas globais de eficiência, tempos e custos. Dados pessoais de pacientes são mascarados." },
      { role: "Médico de Serviço", accessType: "Leitura de Fichas Próprias", scope: "Visualiza estatísticas das suas próprias consultas e prontuários completos apenas dos seus pacientes agendados." },
      { role: "Rececionista / Administrativo", accessType: "Escrita de Tempos de Entrada", scope: "Apenas insere horas de chegada e triagem primária, sem acesso a diagnósticos ou prontuários médicos." }
    ],
    implementationTimeline: [
      { phase: "Fase 1: Protocolo de Privacidade (HIPAA/Regulação Local)", duration: "1 Semana", deliverables: ["Auditoria de segurança e privacidade", "Acordo de confidencialidade", "Mapeamento das bases do hospital"] },
      { phase: "Fase 2: Extração Segura & Anonimização", duration: "2 Semanas", deliverables: ["Desenvolvimento de scripts de mascaramento de dados", "Pipelines de carga encriptados", "Data-lake seguro de teste"] },
      { phase: "Fase 3: Visualização Tática", duration: "1.5 Semanas", deliverables: ["Painel de controle clínico funcional", "Mecanismos de alerta visual para emergências", "Design focado em ecrãs de tablets"] },
      { phase: "Fase 4: Auditoria de Acessos", duration: "1 Semana", deliverables: ["Testes de penetração internos", "Rigoroso controle de acessos de utilizadores", "Simulação de acessos indevidos bloqueados"] },
      { phase: "Fase 5: Lançamento Assistido", duration: "1 Semana", deliverables: ["Painéis operacionais nas salas de triagem", "Formação presencial com equipas médicas e administrativas"] }
    ],
    estimatedResources: "1 Arquiteto de Segurança de Dados (50%), 1 Engenheiro de ETL Sénior (100%), 1 Designer UX/BI (80%), 1 Líder de Projeto Data4Moz (30%)."
  },
  financeiro: {
    fields: [
      { name: "id_transacao", type: "VARCHAR(50)", description: "Identificador único da entrada/saída financeira", required: true, sample: "TRN-982410-MZ" },
      { name: "data_registro", type: "DATE", description: "Data de consolidação do registro financeiro", required: true, sample: "2026-06-29" },
      { name: "categoria_despesa", type: "VARCHAR(40)", description: "Rubrica orçamental correspondente", required: true, sample: "Combustível e Logística" },
      { name: "valor_liquido", type: "DECIMAL(12,2)", description: "Valor financeiro líquido", required: true, sample: "-153200.00 MT" },
      { name: "centro_de_custo", type: "VARCHAR(50)", description: "Unidade de negócio ou departamento responsável", required: true, sample: "Operações Norte" }
    ],
    recommendedCharts: [
      { chartType: "Gráfico de Cascata (Waterfall Chart)", description: "Conciliação de Fluxo de Caixa (Receita vs Despesa)", rationale: "Ideal para compreender o impacto de cada categoria de custo na redução da liquidez mensal." },
      { chartType: "Gráfico de Linha com Projeções", description: "Burn Rate e Previsão de Runway", rationale: "Ajuda a direção financeira a projetar as reservas de capital para os próximos meses com base em regressões lineares simples." },
      { chartType: "Comparador de Desempenho (Target vs Actual)", description: "Execução Orçamental por Centro de Custo", rationale: "Controle rígido de desvios orçamentais por departamento." }
    ],
    securityLevels: [
      { role: "CFO / Diretor Financeiro", accessType: "Acesso Total Irrestrito", scope: "Acesso absoluto a todas as contas, auditorias, projeções de salários e taxas fiscais." },
      { role: "Gestor de Departamento", accessType: "Leitura do Centro de Custo Próprio", scope: "Apenas visualiza a execução orçamental do seu próprio departamento. Dados globais e salários de outros departamentos estão ocultos." },
      { role: "Contabilista / Operador de Caixa", accessType: "Escrita de Lançamentos Diários", scope: "Insere faturas e despesas diárias, mas não visualiza relatórios de fluxo de caixa tático ou análises consolidadas de margens." }
    ],
    implementationTimeline: [
      { phase: "Fase 1: Mapeamento de Planos de Contas", duration: "1 Semana", deliverables: ["Dicionário de regras financeiras", "Mapeamento de ERPs de Contabilidade", "Definição de regras de impostos (IVA, IRPC)"] },
      { phase: "Fase 2: Conciliação Automática", duration: "2 Semanas", deliverables: ["Algoritmos de conciliação bancária integrados", "Normalização de moedas (USD, ZAR, MZN)", "Carga histórica de 2 anos reconciliada"] },
      { phase: "Fase 3: Dashboards de Governação", duration: "1.5 Semanas", deliverables: ["Painéis de Balanço, DRE e Fluxo de Caixa interativos", "Indicadores de liquidez", "Filtros por Centro de Custo"] },
      { phase: "Fase 4: Auditoria de Integridade de Dados", duration: "1 Semana", deliverables: ["Verificação de duplicados em tempo real", "Testes de consistência com relatórios oficiais em PDF", "Validação por auditores internos"] },
      { phase: "Fase 5: Entrega Executiva", duration: "0.5 Semana", deliverables: ["Acesso seguro para a Administração", "Configuração de relatórios automáticos por e-mail", "Suporte VIP ativo"] }
    ],
    estimatedResources: "1 Consultor Financeiro BI Sénior (100%), 1 Engenheiro de Dados Principal (50%), 1 Gestor de Contas Data4Moz (20%)."
  },
  outro: {
    fields: [
      { name: "id_registro", type: "VARCHAR(50)", description: "Identificador geral do registro", required: true, sample: "REG-1002" },
      { name: "data_criacao", type: "TIMESTAMP", description: "Data e hora de registro no sistema", required: true, sample: "2026-06-29 11:15:00" },
      { name: "categoria", type: "VARCHAR(50)", description: "Classificação principal do dado", required: true, sample: "Classificação Geral" },
      { name: "valor_metrica", type: "DECIMAL(10,2)", description: "Métrica quantificável a ser monitorizada", required: true, sample: "450.50" },
      { name: "responsavel_registro", type: "VARCHAR(100)", description: "Utilizador que gerou o registro", required: false, sample: "Operador de Ecrã" }
    ],
    recommendedCharts: [
      { chartType: "Gráfico de Linhas com Marcadores", description: "Tendência Histórica da Métrica Principal", rationale: "Permite monitorizar flutuações e desvios padrão para agir corretivamente perante anomalias." },
      { chartType: "Gráfico de Barras Ordenado", description: "Distribuição por Categoria", rationale: "Fácil identificação visual dos maiores contribuintes para a métrica global." },
      { chartType: "Painel de Metas Semanais (Gauges)", description: "Acompanhamento de Alvos Operacionais", rationale: "Visualização simples para motivar equipas locais no alcance dos resultados estipulados." }
    ],
    securityLevels: [
      { role: "Super-Utilizador (Super Admin)", accessType: "Acesso Completo", scope: "Configuração de ecrãs, exclusão de dados antigos, exportações brutas em CSV e gestão de chaves API." },
      { role: "Utilizador Operacional", accessType: "Inserção e Leitura Simples", scope: "Visualiza apenas o seu próprio histórico e cria novos registros diários." },
      { role: "Utilizador Convidado / Auditor", accessType: "Apenas Visualização Temporária", scope: "Leitura de relatórios específicos pré-compilados sem acesso aos detalhes operacionais pormenorizados." }
    ],
    implementationTimeline: [
      { phase: "Fase 1: Sessões de Discovery", duration: "1 Semana", deliverables: ["Documento de Requisitos Funcionais", "Esboços rápidos em papel", "Acesso a planilhas ou fontes existentes"] },
      { phase: "Fase 2: Conexão e Engenharia Inicial", duration: "1.5 Semanas", deliverables: ["Normalização básica de fontes de dados", "Carga inicial no repositório de dados temporário"] },
      { phase: "Fase 3: Modelagem Visual", duration: "1.5 Semanas", deliverables: ["Dashboard interativo básico", "Filtros rápidos de pesquisa e ordenação", "Configuração de alertas táticos"] },
      { phase: "Fase 4: Validação de Segurança & Dados", duration: "0.5 Semana", deliverables: ["Testes de acessos", "Mapeamento de perfis no sistema", "Correção de incoerências de dados"] },
      { phase: "Fase 5: Entrega Operacional", duration: "0.5 Semana", deliverables: ["Sessão de esclarecimentos técnica", "Documento descritivo de campos", "Lançamento oficial"] }
    ],
    estimatedResources: "1 Analista de Sistemas Sénior (50%), 1 Engenheiro de Dashboard Sénior (100%), 1 Gestor de Projeto Data4Moz (15%)."
  }
};

// API Route: Generate Custom Tailored Dashboard Proposal using Gemini
app.post("/api/generate-proposal", async (req, res) => {
  const { companyName, industry, dataSource, challenges, keyMetrics } = req.body;

  if (!companyName || !industry || !challenges) {
    return res.status(400).json({ error: "Por favor, forneça o nome da empresa, setor e desafios." });
  }

  const normalizedIndustry = (industry as string).toLowerCase();
  const fallback = INDUSTRY_FALLBACKS[normalizedIndustry] || INDUSTRY_FALLBACKS.outro;

  try {
    const ai = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "MOCK_KEY") {
      console.log(`Using smart fallback for industry: ${industry}`);
      // Enhance fallback with actual user input for high fidelity simulation
      const customizedProposal = {
        ...fallback,
        estimatedResources: `Proposta customizada para ${companyName}: ${fallback.estimatedResources}`,
        implementationTimeline: fallback.implementationTimeline.map((f: any, idx: number) => ({
          ...f,
          deliverables: [
            ...f.deliverables,
            idx === 0 ? `Adequação específica para os desafios de ${companyName}` : `Mapeamento focado em ${dataSource || "fontes fornecidas"}`
          ]
        }))
      };
      return res.json(customizedProposal);
    }

    // Call Gemini API with precise JSON constraint
    const systemPrompt = `Você é o Arquiteto de Soluções de Dados Líder na Data4Moz, a empresa líder em engenharia de dados e soluções de Business Intelligence em Moçambique.
Você deve produzir uma proposta técnica e comercial detalhada para o desenvolvimento de um Dashboard de alta performance totalmente personalizado.
Você deve responder estritamente com um objeto JSON válido, sem tags markdown ou explicações externas.

Estrutura JSON esperada:
{
  "fields": [
    { "name": "string", "type": "string", "description": "string", "required": boolean, "sample": "string" }
  ],
  "recommendedCharts": [
    { "chartType": "string", "description": "string", "rationale": "string" }
  ],
  "securityLevels": [
    { "role": "string", "accessType": "string", "scope": "string" }
  ],
  "implementationTimeline": [
    { "phase": "string", "duration": "string", "deliverables": ["string", "string"] }
  ],
  "estimatedResources": "string"
}`;

    const userPrompt = `Gerar proposta técnica detalhada de Dashboard em português para a seguinte empresa cliente:
- Nome da Empresa: ${companyName}
- Setor Industrial: ${industry} (Normalizado: ${normalizedIndustry})
- Fontes de Dados Atuais: ${dataSource || "Planilhas Excel, Bancos de Dados locais e ERP"}
- Desafios e Metas Principais: ${challenges}
- Métricas Desejadas pelo Utilizador: ${keyMetrics && keyMetrics.length ? keyMetrics.join(", ") : "Geral operacional e faturamento"}

Certifique-se de que a resposta seja em português corporativo sofisticado e que todos os campos técnicos mapeados façam completo sentido para o contexto do cliente.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (text) {
      try {
        const parsed = JSON.parse(text.trim());
        return res.json(parsed);
      } catch (e) {
        console.error("Failed to parse Gemini JSON, returning fallback.", e);
        return res.json(fallback);
      }
    } else {
      return res.json(fallback);
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return res.json(fallback);
  }
});

// Vite middleware / Static Asset serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode serving pre-compiled static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
};

startServer();
