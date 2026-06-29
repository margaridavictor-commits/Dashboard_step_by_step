import React, { useState, useEffect, useMemo } from "react";
// @ts-ignore
import data4mozLogo from "./assets/images/data4moz_logo_1782730460946.jpg";
import { 
  TrendingUp, 
  Layout, 
  ShieldCheck, 
  Cpu, 
  Play, 
  CheckCircle, 
  Clock, 
  Database, 
  Eye, 
  Lock, 
  FileText, 
  Send, 
  Sparkles, 
  Building2, 
  Layers, 
  Download, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  EyeOff, 
  User, 
  Activity, 
  CheckSquare,
  ChevronRight,
  Server,
  Zap,
  HelpCircle,
  Briefcase,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { IndustryType, DashboardField, StepInfo, SecurityRole, ProposalResponse } from "./types";

// ==========================================
// MOCK DATA FOR THE DEMONSTRATIONS
// ==========================================

const salesData = [
  { name: "Jan", vendas: 45000, custo: 32000, transacoes: 450 },
  { name: "Fev", vendas: 52000, custo: 34000, transacoes: 510 },
  { name: "Mar", vendas: 49000, custo: 31000, transacoes: 480 },
  { name: "Abr", vendas: 63000, custo: 39000, transacoes: 610 },
  { name: "Mai", vendas: 58000, custo: 37000, transacoes: 550 },
  { name: "Jun", vendas: 74000, custo: 42000, transacoes: 720 },
];

const salesByRegion = [
  { name: "Maputo Cidade", value: 45 },
  { name: "Sofala (Beira)", value: 25 },
  { name: "Nampula", value: 18 },
  { name: "Outras Províncias", value: 12 },
];

const COLORS = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b"];

const logisticData = [
  { name: "Seg", despachados: 120, atrasados: 14, prazos: 106 },
  { name: "Ter", despachados: 145, atrasados: 8, prazos: 137 },
  { name: "Qua", despachados: 132, atrasados: 19, prazos: 113 },
  { name: "Qui", despachados: 160, atrasados: 5, prazos: 155 },
  { name: "Sex", despachados: 178, atrasados: 22, prazos: 156 },
  { name: "Sáb", despachados: 90, atrasados: 3, prazos: 87 },
];

const financialData = [
  { name: "T1-25", receita: 450000, despesa: 380000, margem: 70000 },
  { name: "T2-25", receita: 510000, despesa: 410000, margem: 100000 },
  { name: "T3-25", receita: 540000, despesa: 420000, margem: 120000 },
  { name: "T4-25", receita: 680000, despesa: 490000, margem: 190000 },
];

const securityRowsMock = [
  { id: 1, transacao: "TX-901", regiao: "Maputo Cidade", valor: "15,000 MT", margem: "45%", cliente: "Standard Bank", status: "Aprovado" },
  { id: 2, transacao: "TX-902", regiao: "Sofala (Beira)", valor: "38,500 MT", margem: "38%", cliente: "Cervejas de Moçambique", status: "Aprovado" },
  { id: 3, transacao: "TX-903", regiao: "Nampula", valor: "8,900 MT", margem: "50%", cliente: "Mcel/Telasel", status: "Pendente" },
  { id: 4, transacao: "TX-904", regiao: "Maputo Cidade", valor: "120,000 MT", margem: "29%", cliente: "Moza Banco", status: "Aprovado" },
  { id: 5, transacao: "TX-905", regiao: "Sofala (Beira)", valor: "4,200 MT", margem: "42%", cliente: "Porto de Beira", status: "Aprovado" },
  { id: 6, transacao: "TX-906", regiao: "Cabo Delgado", valor: "210,000 MT", margem: "32%", cliente: "Anadarko Petroleum", status: "Pendente" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"processo" | "demonstracao">("processo");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeDemo, setActiveDemo] = useState<"vendas" | "logistica" | "financeiro">("vendas");

  // Interactive Dashboard States & Memo Calculations
  const [vendasFilterRegion, setVendasFilterRegion] = useState<string>("Todas");
  const [vendasFilterPeriod, setVendasFilterPeriod] = useState<string>("90"); // "30", "90", "365"
  const [vendasFilterChannel, setVendasFilterChannel] = useState<string>("Todos"); // "Todos", "Retalho", "B2B"

  const [logisticaFilterStatus, setLogisticaFilterStatus] = useState<string>("Todas");
  const [logisticaSelectedRoute, setLogisticaSelectedRoute] = useState<{ id: string, dest: string, driver: string, status: string, delay: string, carga: string, km: number, trackerStatus: string } | null>({
    id: "ROT-01", 
    dest: "Maputo > Beira", 
    driver: "João Banze", 
    status: "Em Trânsito", 
    delay: "Sem atrasos",
    carga: "Medicamentos Refrige.",
    km: 1180,
    trackerStatus: "GPS Ativo"
  });

  const [financeSimSalesGrowth, setFinanceSimSalesGrowth] = useState<number>(10); // percentage, default +10%
  const [financeSimCostOptimization, setFinanceSimCostOptimization] = useState<number>(5); // percentage, default 5% reduction

  // Dynamic Vendas Metrics Calculations
  const dynamicSalesMetrics = useMemo(() => {
    let multiplierRegion = 1.0;
    if (vendasFilterRegion === "Maputo Cidade") multiplierRegion = 0.45;
    else if (vendasFilterRegion === "Sofala (Beira)") multiplierRegion = 0.25;
    else if (vendasFilterRegion === "Nampula") multiplierRegion = 0.18;
    else if (vendasFilterRegion === "Outras Províncias") multiplierRegion = 0.12;

    let multiplierPeriod = 1.0;
    if (vendasFilterPeriod === "30") multiplierPeriod = 0.35;
    else if (vendasFilterPeriod === "90") multiplierPeriod = 1.0;
    else if (vendasFilterPeriod === "365") multiplierPeriod = 3.8;

    let multiplierChannel = 1.0;
    if (vendasFilterChannel === "Retalho") multiplierChannel = 0.62;
    else if (vendasFilterChannel === "B2B") multiplierChannel = 0.38;

    const totalMultiplier = multiplierRegion * multiplierPeriod * multiplierChannel;

    const baseFaturacao = 326000 * totalMultiplier;
    const baseTransacoes = Math.round(3320 * totalMultiplier);
    const baseTicket = baseTransacoes > 0 ? (baseFaturacao / baseTransacoes) : 0;
    
    let baseMargem = 41.3;
    if (vendasFilterRegion === "Maputo Cidade") baseMargem += 1.5;
    if (vendasFilterChannel === "B2B") baseMargem -= 2.0;

    return {
      faturacao: Math.round(baseFaturacao),
      transacoes: baseTransacoes,
      ticket: Number(baseTicket.toFixed(2)),
      margem: Number(baseMargem.toFixed(1))
    };
  }, [vendasFilterRegion, vendasFilterPeriod, vendasFilterChannel]);

  // Dynamic Sales Area Chart Data
  const dynamicSalesData = useMemo(() => {
    let multiplierRegion = 1.0;
    if (vendasFilterRegion === "Maputo Cidade") multiplierRegion = 0.45;
    else if (vendasFilterRegion === "Sofala (Beira)") multiplierRegion = 0.25;
    else if (vendasFilterRegion === "Nampula") multiplierRegion = 0.18;
    else if (vendasFilterRegion === "Outras Províncias") multiplierRegion = 0.12;

    let multiplierChannel = 1.0;
    if (vendasFilterChannel === "Retalho") multiplierChannel = 0.62;
    else if (vendasFilterChannel === "B2B") multiplierChannel = 0.38;

    const totalMultiplier = multiplierRegion * multiplierChannel;

    return salesData.map(item => {
      const vendasMod = Math.round(item.vendas * totalMultiplier);
      const custoMod = Math.round(item.custo * totalMultiplier);
      return {
        ...item,
        vendas: vendasMod,
        custo: custoMod,
        transacoes: Math.round(item.transacoes * totalMultiplier)
      };
    });
  }, [vendasFilterRegion, vendasFilterChannel]);

  // Logistics list data
  const routesData = useMemo(() => [
    { id: "ROT-01", dest: "Maputo > Beira", driver: "João Banze", status: "Em Trânsito", delay: "Sem atrasos", carga: "Medicamentos Refrige.", km: 1180, trackerStatus: "GPS Ativo" },
    { id: "ROT-02", dest: "Beira > Nampula", driver: "Moisés Langa", status: "Atrasado (Pneu)", delay: "+45 min", carga: "Material de Construção", km: 920, trackerStatus: "Sinal Fraco" },
    { id: "ROT-03", dest: "Nampula > Nacala", driver: "Arnaldo Tembe", status: "Entregue", delay: "SLA OK", carga: "Produtos Agrícolas", km: 200, trackerStatus: "Concluído" },
    { id: "ROT-04", dest: "Maputo > Xai-Xai", driver: "Delfim Sigaúque", status: "Em Trânsito", delay: "Sem atrasos", carga: "Bens Alimentares", km: 224, trackerStatus: "GPS Ativo" },
    { id: "ROT-05", dest: "Nampula > Pemba", driver: "Amílcar Santos", status: "Atrasado (Chuva)", delay: "+2 Horas", carga: "Combustível (Galp)", km: 410, trackerStatus: "GPS Ativo" },
    { id: "ROT-06", dest: "Beira > Tete", driver: "Geraldo Alface", status: "Entregue", delay: "SLA OK", carga: "Cimento Nacional", km: 640, trackerStatus: "Concluído" },
  ], []);

  // Filter routes
  const dynamicRoutes = useMemo(() => {
    if (logisticaFilterStatus === "Todas") return routesData;
    if (logisticaFilterStatus === "Em Trânsito") return routesData.filter(r => r.status === "Em Trânsito");
    if (logisticaFilterStatus === "Atrasadas") return routesData.filter(r => r.status.startsWith("Atrasado"));
    if (logisticaFilterStatus === "Entregues") return routesData.filter(r => r.status === "Entregue");
    return routesData;
  }, [logisticaFilterStatus, routesData]);

  // Dynamic Finance simulation variables
  const simulatedFinancials = useMemo(() => {
    const baseReceita = 680000;
    const baseDireto = 420000;
    const baseCorp = 260000;
    const baseCMV = -240000;
    const basePessoal = -130000;

    const salesMultiplier = 1 + (financeSimSalesGrowth / 100);
    const costSavingsMultiplier = 1 - (financeSimCostOptimization / 100);

    const receitaSim = Math.round(baseReceita * salesMultiplier);
    const diretoSim = Math.round(baseDireto * salesMultiplier);
    const corpSim = Math.round(baseCorp * salesMultiplier);
    
    // CMV scales partially with sales (variable cost) but optimized
    const cmvSim = Math.round(baseCMV * salesMultiplier * costSavingsMultiplier);
    // Pessoal is fixed cost optimized
    const pessoalSim = Math.round(basePessoal * costSavingsMultiplier);

    const lucroSim = receitaSim + cmvSim + pessoalSim;
    const margemSim = receitaSim > 0 ? Number(((lucroSim / receitaSim) * 100).toFixed(1)) : 0;

    const baseLucro = baseReceita + baseCMV + basePessoal;
    const lucroImpact = lucroSim - baseLucro;

    return {
      receita: receitaSim,
      direto: diretoSim,
      corp: corpSim,
      cmv: cmvSim,
      pessoal: pessoalSim,
      lucro: lucroSim,
      margem: margemSim,
      lucroImpact
    };
  }, [financeSimSalesGrowth, financeSimCostOptimization]);

  // Dynamic Financial Chart (shows baseline or adjusted based on growth)
  const dynamicFinancialData = useMemo(() => {
    const growthFact = 1 + (financeSimSalesGrowth / 100) * 0.8;
    const costFact = 1 - (financeSimCostOptimization / 100) * 0.5;

    return financialData.map(item => {
      const rec = Math.round(item.receita * growthFact);
      const desp = Math.round(item.despesa * costFact);
      return {
        ...item,
        receita: rec,
        despesa: desp,
        margem: rec - desp
      };
    });
  }, [financeSimSalesGrowth, financeSimCostOptimization]);

  // State for Paso 1 Discovery Alignment
  const [p1Challenge, setP1Challenge] = useState<string>("");
  const [localDiagnosticResult, setLocalDiagnosticResult] = useState<string | null>(null);
  
  // State for Passo 2 Field Selector Simulation
  const [p2Industry, setP2Industry] = useState<IndustryType>("vendas");
  const [p2Fields, setP2Fields] = useState<DashboardField[]>([]);
  const [p2CustomFieldName, setP2CustomFieldName] = useState<string>("");
  const [p2CustomFieldType, setP2CustomFieldType] = useState<string>("VARCHAR(50)");
  const [p2CustomFieldDesc, setP2CustomFieldDesc] = useState<string>("");

  // State for Passo 3 Wireframer Setup
  const [p3Theme, setP3Theme] = useState<"slate" | "indigo" | "emerald" | "amber">("slate");
  const [p3Layout, setP3Layout] = useState<"compact" | "cozy">("cozy");
  
  // State for Passo 4 Integrity Tester
  const [isQAtesting, setIsQAtesting] = useState<boolean>(false);
  const [qaLogs, setQaLogs] = useState<string[]>([]);
  const [qaProgress, setQaProgress] = useState<number>(0);
  const [qaStatus, setQaStatus] = useState<"idle" | "running" | "success">("idle");

  // State for Passo 5 Role Simulation
  const [p5Role, setP5Role] = useState<"admin" | "manager_sofala" | "operator_maputo">("admin");

  // State for Passo 6 Monitor log simulator
  const [sysCpu, setSysCpu] = useState<number>(14);
  const [sysMem, setSysMem] = useState<number>(38);
  const [sysLatency, setSysLatency] = useState<number>(18);
  const [logsList, setLogsList] = useState<string[]>([]);

  // State for Proposal Co-Creator (IA Tab)
  const [proposalForm, setProposalForm] = useState({
    companyName: "",
    industry: "vendas" as IndustryType,
    dataSource: "",
    challenges: "",
    keyMetrics: [] as string[]
  });
  const [isGeneratingProposal, setIsGeneratingProposal] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [proposalResult, setProposalResult] = useState<ProposalResponse | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Suggested pre-fill queries for margarida
  const prefillAIProposal = (sector: IndustryType) => {
    if (sector === "vendas") {
      setProposalForm({
        companyName: "Data4Moz Retail Corp",
        industry: "vendas",
        dataSource: "Planilhas Excel de Faturação, ERP SAGE, Logs de Vendas Online (PostgreSQL)",
        challenges: "Não conseguimos ver a margem líquida consolidada em tempo real por província. Demoramos 5 dias após o final do mês para fechar o relatório de vendas diárias e temos muitos dados duplicados entre as lojas física e online.",
        keyMetrics: ["Faturação Líquida", "Margem Comercial", "Ticket Médio por Província", "Top 10 Clientes VIP"]
      });
    } else if (sector === "logistica") {
      setProposalForm({
        companyName: "Moçambique Distribuição Lda",
        industry: "logistica",
        dataSource: "Planilhas de despacho manuais, GPS Tracker API, ERP Primavera",
        challenges: "Muitas remessas chegam atrasadas à Beira e Nampula e não sabemos o real fator (se é avaria, combustível ou tempo de despacho). Falta de visão de SLA em tempo real para a Diretoria.",
        keyMetrics: ["Taxa de Entrega no Prazo (SLA)", "Tempo Médio de Trânsito", "Custo de Combustível por KM", "Alertas de Atrasos Críticos"]
      });
    } else if (sector === "saude") {
      setProposalForm({
        companyName: "Clínica Saúde Vital Maputo",
        industry: "saude",
        dataSource: "Fichas eletrónicas de triagem, Sistema interno de agendamento SQL Server",
        challenges: "O tempo de espera na recepção está muito alto (mais de 45 minutos) gerando reclamações dos utentes. Precisamos otimizar a distribuição de médicos nas salas de triagem por horários de pico sem expor dados privados dos utentes.",
        keyMetrics: ["Tempo de Espera Médio", "Satisfação do Paciente (1-5)", "Ocupação de Salas", "Afluxo por Especialidade"]
      });
    }
  };

  // Prepopulate step fields automatically
  useEffect(() => {
    const defaultFields: Record<IndustryType, DashboardField[]> = {
      vendas: [
        { name: "id_venda", type: "VARCHAR(50)", description: "ID único da transação", required: true, sample: "VND-2026-901" },
        { name: "valor_total", type: "DECIMAL(12,2)", description: "Valor faturado", required: true, sample: "15450.00 MT" },
        { name: "provincia", type: "VARCHAR(40)", description: "Província da venda", required: true, sample: "Sofala" },
        { name: "data_venda", type: "TIMESTAMP", description: "Data/hora do registro", required: true, sample: "2026-06-29 08:30:00" },
      ],
      logistica: [
        { name: "id_remessa", type: "VARCHAR(50)", description: "Código de rastreio", required: true, sample: "TRK-MAP-451" },
        { name: "tempo_horas", type: "INT", description: "Duração em trânsito", required: true, sample: "14" },
        { name: "status_envio", type: "VARCHAR(20)", description: "Status da entrega", required: true, sample: "Entregue" },
        { name: "combustivel_custo", type: "DECIMAL(8,2)", description: "Custo com combustível", required: false, sample: "5400.00 MT" },
      ],
      saude: [
        { name: "id_consulta", type: "VARCHAR(50)", description: "Código de consulta", required: true, sample: "CNS-8812" },
        { name: "espera_minutos", type: "INT", description: "Minutos em triagem", required: true, sample: "35" },
        { name: "especialidade", type: "VARCHAR(50)", description: "Especialidade clínica", required: true, sample: "Pediatria" },
        { name: "idade_paciente", type: "INT", description: "Idade para dados demográficos", required: false, sample: "29" },
      ],
      financeiro: [
        { name: "id_movimento", type: "VARCHAR(50)", description: "ID único contábil", required: true, sample: "MOV-33012" },
        { name: "valor_liquido", type: "DECIMAL(12,2)", description: "Montante bruto", required: true, sample: "-85000.00 MT" },
        { name: "rubrica_contabil", type: "VARCHAR(50)", description: "Categoria de despesa/receita", required: true, sample: "Telecomunicações" },
        { name: "centro_custo", type: "VARCHAR(50)", description: "Departamento responsável", required: true, sample: "Operações Norte" },
      ],
      outro: [
        { name: "id_registro", type: "VARCHAR(50)", description: "Código geral", required: true, sample: "REG-011" },
        { name: "data_registro", type: "DATE", description: "Data de registro", required: true, sample: "2026-06-29" },
        { name: "valor_metrica", type: "DECIMAL(10,2)", description: "Valor da métrica", required: true, sample: "1450.25" },
      ]
    };
    setP2Fields(defaultFields[p2Industry]);
  }, [p2Industry]);

  // Handle addition of custom fields in Step 2
  const handleAddCustomField = () => {
    if (!p2CustomFieldName.trim()) return;
    const newField: DashboardField = {
      name: p2CustomFieldName.toLowerCase().replace(/\s+/g, "_"),
      type: p2CustomFieldType,
      description: p2CustomFieldDesc || "Campo personalizado inserido pelo utilizador",
      required: false,
      sample: p2CustomFieldType === "INT" ? "42" : p2CustomFieldType.includes("DECIMAL") ? "1250.00 MT" : "Exemplo Customizado"
    };
    setP2Fields([...p2Fields, newField]);
    setP2CustomFieldName("");
    setP2CustomFieldDesc("");
  };

  // Generate dynamic SQL representation based on Step 2 schema
  const generatedSQL = useMemo(() => {
    const fieldsSql = p2Fields.map(f => `  ${f.name} ${f.type} ${f.required ? "NOT NULL" : "DEFAULT NULL"} -- ${f.description}`).join(",\n");
    return `CREATE TABLE datadash_dw.${p2Industry}_logs (\n${fieldsSql}\n);`;
  }, [p2Fields, p2Industry]);

  // Run simulated QA test suite in Step 4
  const startQATestSimulation = () => {
    setIsQAtesting(true);
    setQaStatus("running");
    setQaProgress(0);
    setQaLogs([]);
    
    const messages = [
      "Conectando à base de dados de ensaio datadash_dw...",
      "Iniciando varredura de integridade estrutural...",
      "Validando campos obrigatórios: id_registro, valor, data...",
      "Sucesso: Zero valores nulos em colunas marcadas como NOT NULL.",
      "Iniciando verificação de tipos de dados (Data Type Integrity)...",
      "Alerta: Encontrados 4 registros com datas em formato incorreto (Auto-corrigido).",
      "Executando verificação de duplicados em chaves primárias...",
      "Sucesso: Integridade referencial validada de forma rigorosa (100% de consistência).",
      "Iniciando testes de vazamento de segurança e simulação de acessos...",
      "Sucesso: Políticas de segurança Row-Level Security (RLS) validadas contra invasão.",
      "Análise de latência do dashboard concluída. Tempo médio de resposta: 18ms (Aprovado).",
      "FIM DO AUDIT: Todos os testes de qualidade foram aprovados com distinção! (Green Build)"
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < messages.length) {
        setQaLogs(prev => [...prev, messages[currentIdx]]);
        setQaProgress(Math.round(((currentIdx + 1) / messages.length) * 100));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsQAtesting(false);
        setQaStatus("success");
      }
    }, 450);
  };

  // Simulate server stats and logs ticking in step 6
  useEffect(() => {
    const logPool = [
      "INFO: Carregamento do painel por admin_maputo (12ms)",
      "INFO: Atualização automática de cache concluída (8ms)",
      "INFO: Pipeline ETL Primavera executada com sucesso. 1,432 linhas importadas.",
      "INFO: Nova requisição recebida de gestor_beira. RLS aplicado para região: Sofala.",
      "WARN: Tentativa de leitura não autorizada de margem_vendas por utilizador_operacional bloqueada.",
      "INFO: Backup incremental executado com sucesso.",
      "INFO: Latência de leitura para banco PostgreSQL estável em 14ms."
    ];
    setLogsList([
      "SYSTEM: Dev server iniciado com sucesso na porta 3000.",
      "SYSTEM: Banco de dados cloud centralizado conectado (SSL Ativo).",
      "INFO: Primeiros acessos de utilizadores autorizados."
    ]);

    const interval = setInterval(() => {
      // Fluctuate CPU and Mem a bit
      setSysCpu(prev => Math.max(8, Math.min(65, prev + Math.floor(Math.random() * 9) - 4)));
      setSysMem(prev => Math.max(30, Math.min(90, prev + Math.floor(Math.random() * 3) - 1)));
      setSysLatency(prev => Math.max(10, Math.min(35, prev + Math.floor(Math.random() * 5) - 2)));
      
      const newLog = logPool[Math.floor(Math.random() * logPool.length)];
      setLogsList(prev => [newLog, ...prev.slice(0, 15)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filter security rows based on Step 5 simulation role
  const filteredSecurityRows = useMemo(() => {
    if (p5Role === "admin") {
      return securityRowsMock;
    } else if (p5Role === "manager_sofala") {
      return securityRowsMock.filter(r => r.regiao === "Sofala (Beira)");
    } else {
      // Operator Maputo - only see Maputo, and sensitive fields (margem, cliente) are masked!
      return securityRowsMock
        .filter(r => r.regiao === "Maputo Cidade")
        .map(r => ({
          ...r,
          margem: "RESTRITO",
          cliente: "CONFIDENCIAL"
        }));
    }
  }, [p5Role]);

  // Handle submission of the form to generate custom proposal via Gemini API
  const handleGenerateProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.companyName || !proposalForm.challenges) {
      alert("Por favor, introduza o nome da empresa e descreva as metas/desafios.");
      return;
    }

    setIsGeneratingProposal(true);
    setProposalResult(null);

    const steps = [
      "Alinhando objetivos estratégicos com Data4Moz...",
      "Identificando chaves de conexão para fontes de dados...",
      "Gemini AI está a desenhar a estrutura de dados relacional ideal...",
      "Projetando políticas de segurança de linhas de acesso...",
      "Montando cronograma de desenvolvimento focado e realístico...",
      "Finalizando proposta comercial personalizada..."
    ];

    // Simulate stepping through progress so user has a wonderful visual cue
    let currentStepIdx = 0;
    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
        currentStepIdx++;
      }
    }, 700);

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalForm)
      });
      
      const data = await response.json();
      clearInterval(stepInterval);
      setProposalResult(data);
    } catch (err) {
      console.error("Error generating proposal:", err);
      clearInterval(stepInterval);
      alert("Houve um erro técnico. Por favor, tente novamente.");
    } finally {
      setIsGeneratingProposal(false);
      setLoadingStep("");
    }
  };

  // Export proposal text to clipboard or markdown
  const copyProposalToClipboard = () => {
    if (!proposalResult) return;
    
    let text = `# Proposta de Desenvolvimento de Dashboard - Data4Moz\n`;
    text += `Cliente: ${proposalForm.companyName}\n`;
    text += `Setor: ${proposalForm.industry.toUpperCase()}\n`;
    text += `Fontes de Dados: ${proposalForm.dataSource || "Planilhas e ERP"}\n\n`;
    
    text += `## 1. Estrutura de Campos Mapeada\n`;
    proposalResult.fields.forEach(f => {
      text += `- \`${f.name}\` (${f.type}): ${f.description} (Ex: ${f.sample})\n`;
    });
    
    text += `\n## 2. Gráficos Recomendados\n`;
    proposalResult.recommendedCharts.forEach(c => {
      text += `- **${c.chartType}**: ${c.description}\n  *Justificação:* ${c.rationale}\n`;
    });
    
    text += `\n## 3. Segurança e Perfis de Acesso\n`;
    proposalResult.securityLevels.forEach(s => {
      text += `- **${s.role}**: Nível \`${s.accessType}\` - Âmbito: ${s.scope}\n`;
    });
    
    text += `\n## 4. Cronograma de Implementação\n`;
    proposalResult.implementationTimeline.forEach(t => {
      text += `- **${t.phase}** (${t.duration})\n  *Entregáveis:* ${t.deliverables.join(", ")}\n`;
    });
    
    text += `\n## 5. Recursos e Alocação Sugeridos\n`;
    text += `${proposalResult.estimatedResources}\n\n`;
    text += `--- \nData4Moz Lda - Moçambique. Excelência em Business Intelligence.`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Steps Information Array for Process Pitch
  const stepsData: StepInfo[] = [
    {
      number: 1,
      title: "Primeiro Contacto",
      subtitle: "Alinhamento de Objetivos",
      description: "",
      icon: "Briefcase",
      badge: "Discovery",
      keyPoints: [
        "Identificação de gargalos operacionais",
        "Estudo de retorno sobre investimento (ROI)",
        "Definição preliminar de utilizadores chave",
        "Mapeamento de sistemas existentes (Sage, Primavera, Excel)"
      ],
      interactiveTitle: "Simulador de Alinhamento Estratégico",
      duration: "1 a 3 Dias"
    },
    {
      number: 2,
      title: "Definição de Campos",
      subtitle: "Modelagem de Dados & Fontes",
      description: "",
      icon: "Database",
      badge: "Arquitetura",
      keyPoints: [
        "Normalização e eliminação de duplicados",
        "Construção de Pipelines automáticos (ETL/ELT)",
        "Definição das colunas chave do banco",
        "Suporte a arquivos manuais e bancos SQL dinâmicos"
      ],
      interactiveTitle: "Modelador de Campos & SQL Autogerado",
      duration: "3 a 5 Dias"
    },
    {
      number: 3,
      title: "Design & UX",
      subtitle: "Prototipagem de Alta Fidelidade",
      description: "",
      icon: "Layout",
      badge: "Visual & UX",
      keyPoints: [
        "Interfaces responsivas (Computador, Tablet e Mobile)",
        "Temas confortáveis para uso diurno e noturno",
        "Gráficos focados em rápida compreensão cognitiva",
        "Filtros de pesquisa intuitivos e rápidos"
      ],
      interactiveTitle: "Visualizador de Protótipos & Wireframes",
      duration: "1 a 2 Semanas"
    },
    {
      number: 4,
      title: "Testagem",
      subtitle: "Garantia de Qualidade & Velocidade",
      description: "",
      icon: "Activity",
      badge: "Qualidade / QA",
      keyPoints: [
        "Varredura automática contra dados duplicados",
        "Verificação de consistência histórica de valores",
        "Ajustes finos de indexação e velocidade da base de dados",
        "Auditoria de consistência financeira"
      ],
      interactiveTitle: "Consola de Testes Automáticos de Integridade",
      duration: "1 Semana"
    },
    {
      number: 5,
      title: "Segurança & Perfis",
      subtitle: "Controle de Acessos Rigoroso",
      description: "",
      icon: "ShieldCheck",
      badge: "Cibersegurança",
      keyPoints: [
        "Regras estritas de Row-Level Security (RLS)",
        "Mascaramento dinâmico de dados sensíveis dos clientes",
        "Integração com contas empresariais (Active Directory/Google Workspace)",
        "Trilhas de auditoria para monitorar acessos"
      ],
      interactiveTitle: "Simulador de Regras de Acesso por Perfil",
      duration: "3 a 5 Dias"
    },
    {
      number: 6,
      title: "Lançamento & Suporte",
      subtitle: "Produção, Monitoria & Suporte Ativo",
      description: "",
      icon: "Cpu",
      badge: "Produção",
      keyPoints: [
        "Alojamento Cloud estável com custos sob controle",
        "Formação prática e vídeos curtos de capacitação",
        "Monitoria active de recursos do servidor e erros",
        "Suporte técnico ágil para criação de novos relatórios"
      ],
      interactiveTitle: "Painel de Controle de Produção & Monitorização",
      duration: "Contínuo"
    }
  ];

  const currentStepData = stepsData[activeStep - 1];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white" id="app-root">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 px-4 py-3 sm:px-6 shadow-sm" id="header-container">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center shadow-sm">
              <img 
                src={data4mozLogo} 
                alt="Data4Moz Logo" 
                className="h-10 w-10 object-contain rounded-full"
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Data4Moz</span>
                <span className="text-slate-600 text-xs px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">Dashboards</span>
              </div>
              <p className="text-xs text-slate-500">Transformamos Dados em Decisões de Alta Performance</p>
            </div>
          </div>

          {/* MAIN TABS NAVIGATION */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200" id="nav-tabs">
            <button
              id="tab-processo"
              onClick={() => setActiveTab("processo")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === "processo"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="h-4 w-4" />
              O Nosso Processo (6 Passos)
            </button>
            <button
              id="tab-demonstracao"
              onClick={() => setActiveTab("demonstracao")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === "demonstracao"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layout className="h-4 w-4" />
              Demonstração de Painéis
            </button>
          </nav>

          {/* USER WELCOME AND BRAND ACCENT */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700 font-medium">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Moçambique • Margarida Victor</span>
          </div>
        </div>
      </header>

      {/* HERO HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6" id="hero-banner">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            A Solução Definitiva em Business Intelligence
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
            Desenvolvemos o Seu Dashboard <br />
            <span className="text-blue-600 font-black">Do Primeiro Contacto ao Lançamento</span>
          </h1>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" id="main-content-layout">
        
        {/* TAB 1: O NOSSO PROCESSO (6 PASSOS PITCH) */}
        {activeTab === "processo" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="process-view">
            
            {/* Left Side: Steps Menu (Timeline) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity className="text-blue-600 h-5 w-5" />
                  Roteiro de Desenvolvimento
                </h2>
                <p className="text-slate-500 text-xs mt-1">Selecione cada fase para ver as dores que resolvemos e experimentar o simulador.</p>
              </div>

              <div className="flex flex-col gap-2.5 relative pl-4 border-l border-slate-200">
                {stepsData.map((step) => {
                  const isCurrent = activeStep === step.number;
                  return (
                    <button
                      key={step.number}
                      onClick={() => setActiveStep(step.number)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                        isCurrent 
                          ? "bg-blue-600 border-blue-700 shadow-md shadow-blue-500/10 text-white translate-x-2" 
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {/* Connection Dot on Timeline */}
                      <div className={`absolute -left-[21px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border transition-all duration-300 ${
                        isCurrent 
                          ? "bg-blue-600 border-white ring-4 ring-blue-500/10 scale-125" 
                          : "bg-slate-200 border-slate-300 group-hover:bg-slate-400"
                      }`}></div>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          isCurrent 
                            ? "bg-blue-700/50 text-white border border-blue-500/30" 
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          Passo {step.number} • {step.badge}
                        </span>
                        
                        <span className={`text-[10px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded font-bold ${
                          isCurrent 
                            ? "bg-blue-700/30 text-blue-100" 
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}>
                          <Clock className="h-3 w-3 shrink-0" />
                          {step.duration}
                        </span>
                      </div>
                      
                      <h3 className={`text-sm font-bold mt-2 transition-colors ${
                        isCurrent ? "text-white" : "text-slate-900 group-hover:text-blue-600"
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-1 ${
                        isCurrent ? "text-blue-100" : "text-slate-500"
                      }`}>
                        {step.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Step Detailed Info & Interactive Simulator */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Detailed Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                    {currentStepData.number === 1 && <Briefcase className="h-6 w-6" />}
                    {currentStepData.number === 2 && <Database className="h-6 w-6" />}
                    {currentStepData.number === 3 && <Layout className="h-6 w-6" />}
                    {currentStepData.number === 4 && <Activity className="h-6 w-6" />}
                    {currentStepData.number === 5 && <ShieldCheck className="h-6 w-6" />}
                    {currentStepData.number === 6 && <Cpu className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-blue-600 tracking-wider uppercase font-mono">FASE DETALHADA</span>
                      <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Tempo Estimado: {currentStepData.duration}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {currentStepData.number}. {currentStepData.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{currentStepData.subtitle}</p>
                  </div>
                </div>

                {currentStepData.description && (
                  <p className="text-slate-600 text-sm mt-5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    {currentStepData.description}
                  </p>
                )}

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Principais Atividades e Entregas:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStepData.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                        <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Simulator Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                
                {/* Simulator Header */}
                <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                      {currentStepData.interactiveTitle}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 uppercase font-bold">
                    Sandbox Ativo
                  </span>
                </div>

                <div className="p-5 bg-slate-50/30">
                  {/* SIMULATOR 1: PRIMEIRO CONTACTO */}
                  {currentStepData.number === 1 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Que metas de dados quer atingir ou quais são os maiores gargalos atuais do seu negócio? Experimente simular uma resposta rápida abaixo para receber imediatamente um diagnóstico inicial estratégico da Data4Moz:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {[
                          "Tenho imensas folhas Excel espalhadas e demora dias para fechar faturamento.",
                          "Quero controlar atrasos de frota e SLA na Beira.",
                          "O tempo de triagem dos pacientes em pediatria está muito alto.",
                          "O Diretor Financeiro não tem visão consolidada das margens por província."
                        ].map((txt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setP1Challenge(txt);
                              setLocalDiagnosticResult(null);
                            }}
                            className="text-left p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer font-medium"
                          >
                            {txt}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 items-center mt-3">
                        <input
                          type="text"
                          value={p1Challenge}
                          onChange={(e) => {
                            setP1Challenge(e.target.value);
                            setLocalDiagnosticResult(null);
                          }}
                          placeholder="Ou descreva o seu próprio desafio aqui..."
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <button
                          onClick={() => {
                            if (!p1Challenge.trim()) return;
                            let rec = "";
                            if (p1Challenge.includes("Excel") || p1Challenge.includes("faturamento")) {
                              rec = "Recomendamos a unificação das fontes de dados via API na nuvem e criação de um pipeline automatizado com Dbt/PostgreSQL. Isso reduzirá o fechamento de faturamento de dias para menos de 5 minutos, com atualização de hora em hora.";
                            } else if (p1Challenge.includes("frota") || p1Challenge.includes("SLA") || p1Challenge.includes("Beira")) {
                              rec = "Sugerimos a integração direta de telemetria GPS (via IoT) num painel operacional centralizado com alertas visuais de desvios. O monitoramento em tempo real permitirá identificar gargalos de trânsito nas rotas da Beira de imediato.";
                            } else if (p1Challenge.includes("triagem") || p1Challenge.includes("pacientes") || p1Challenge.includes("pediatria")) {
                              rec = "Propomos a modelagem do tempo médio de atendimento (TAT) por triagem. Com painéis de densidade de pacientes por hora, a gestão clínica poderá redistribuir enfermeiros nos horários de pico automaticamente.";
                            } else if (p1Challenge.includes("Financeiro") || p1Challenge.includes("margens") || p1Challenge.includes("província")) {
                              rec = "Idealizamos a consolidação das margens brutas aplicando Row-Level Security (RLS). O Diretor Financeiro terá o mapa consolidado interativo com zoom nas províncias (Maputo, Sofala, Nampula) de forma instantânea.";
                            } else {
                              rec = `Para o seu desafio ("${p1Challenge}"), a Data4Moz recomenda a criação de um repositório centralizado de dados. No passo seguinte (Definição de Campos), estruturamos as colunas e métricas exatas para resolver este gargalo com precisão absoluta.`;
                            }
                            setLocalDiagnosticResult(rec);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-sm"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Gerar Diagnóstico
                        </button>
                      </div>

                      {localDiagnosticResult && (
                        <div className="bg-blue-50/70 border border-blue-200 text-slate-700 p-4 rounded-xl text-xs flex flex-col gap-2 mt-2">
                          <div className="flex items-center gap-1.5 text-blue-800 font-bold uppercase tracking-wider font-mono">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Diagnóstico Preliminar Data4Moz:
                          </div>
                          <p className="leading-relaxed font-semibold">{localDiagnosticResult}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Este diagnóstico simula o primeiro contacto técnico de desenho de requisitos.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SIMULATOR 2: DEFINIÇÃO DE CAMPOS */}
                  {currentStepData.number === 2 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Simule a definição da tabela de dados no Data Warehouse (DW) da sua empresa. Selecione o setor industrial para ver os campos mínimos recomendados e adicione novas colunas personalizadas para ver a DDL SQL ser reestruturada instantaneamente:
                      </p>

                      <div className="flex items-center justify-between gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-500">Indústria:</span>
                        <div className="flex gap-1.5">
                          {(["vendas", "logistica", "saude", "financeiro"] as IndustryType[]).map((ind) => (
                            <button
                              key={ind}
                              onClick={() => setP2Industry(ind)}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded ${
                                p2Industry === ind 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                              }`}
                            >
                              {ind}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add Custom Field row */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Nome do Campo</label>
                          <input
                            type="text"
                            value={p2CustomFieldName}
                            onChange={(e) => setP2CustomFieldName(e.target.value)}
                            placeholder="ex: id_vendedor"
                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          />
                        </div>
                        <div className="w-full sm:w-1/3">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Tipo de Dado</label>
                          <select
                            value={p2CustomFieldType}
                            onChange={(e) => setP2CustomFieldType(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          >
                            <option value="VARCHAR(50)">VARCHAR(50)</option>
                            <option value="INT">INT (Inteiro)</option>
                            <option value="DECIMAL(12,2)">DECIMAL(12,2)</option>
                            <option value="TIMESTAMP">TIMESTAMP</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                          </select>
                        </div>
                        <button
                          onClick={handleAddCustomField}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded text-xs border border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          + Adicionar
                        </button>
                      </div>

                      {/* Fields Table & Live Code Visualizer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase font-mono">Estrutura de Linha Selecionada:</span>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 max-h-44 overflow-y-auto p-2">
                            {p2Fields.map((field, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-slate-200 py-1.5 px-2 last:border-0 text-xs">
                                <div className="flex flex-col">
                                  <span className="font-mono text-blue-600 font-bold">{field.name}</span>
                                  <span className="text-[10px] text-slate-500 line-clamp-1 font-medium">{field.description}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-right">
                                  <span className="font-mono text-slate-600 text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">{field.type}</span>
                                  {field.required && (
                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">PK</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase font-mono">SQL DDL Gerado Automático:</span>
                          <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[9px] text-blue-200 leading-relaxed overflow-x-auto">
                            {generatedSQL}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIMULATOR 3: DESIGN & UX */}
                  {currentStepData.number === 3 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Experimente a flexibilidade do design. Escolha diferentes paletes de cores corporativas (Temas) e níveis de espaçamento de ecrã para ver como o layout do seu futuro dashboard se adapta instantaneamente:
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Palete:</span>
                          <div className="flex gap-1.5">
                            {(["slate", "indigo", "emerald", "amber"] as const).map((thm) => (
                              <button
                                key={thm}
                                onClick={() => setP3Theme(thm)}
                                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                  p3Theme === thm 
                                    ? "bg-blue-600 text-white border-blue-600" 
                                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                                }`}
                              >
                                {thm}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Layout:</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setP3Layout("compact")}
                              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                p3Layout === "compact" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              Compacto
                            </button>
                            <button
                              onClick={() => setP3Layout("cozy")}
                              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                p3Layout === "cozy" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              Espaçado
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mock Layout Grid representing a Dashboard Wireframe */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 min-h-[160px]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-1.5">
                            <div className={`h-3.5 w-3.5 rounded-md ${
                              p3Theme === "slate" ? "bg-slate-400" :
                              p3Theme === "indigo" ? "bg-indigo-500" :
                              p3Theme === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                            }`}></div>
                            <span className="font-bold text-[10px] uppercase font-mono tracking-wider text-slate-700">Painel Executivo</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="h-2 w-8 bg-slate-200 rounded"></div>
                            <div className="h-2 w-12 bg-slate-200 rounded"></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { title: "Faturação Total", val: "1.250.000 MT", desc: "+12.4%" },
                            { title: "Custos de Frota", val: "420.500 MT", desc: "-4.2%" },
                            { title: "Clientes Ativos", val: "840", desc: "+8.3%" },
                          ].map((card, i) => (
                            <div key={i} className={`rounded-lg border transition-all ${
                              p3Layout === "compact" ? "p-2.5" : "p-4"
                            } ${
                              p3Theme === "slate" ? "bg-white border-slate-200 hover:border-slate-300" :
                              p3Theme === "indigo" ? "bg-indigo-50/50 border-indigo-100 hover:border-indigo-200" :
                              p3Theme === "emerald" ? "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200" :
                              "bg-amber-50/50 border-amber-100 hover:border-amber-200"
                            }`}>
                              <span className="text-[8px] text-slate-500 font-bold block uppercase">{card.title}</span>
                              <span className={`font-black tracking-tight block ${
                                p3Layout === "compact" ? "text-xs mt-0.5" : "text-sm mt-1"
                              } ${
                                p3Theme === "slate" ? "text-slate-800" :
                                p3Theme === "indigo" ? "text-indigo-800" :
                                p3Theme === "emerald" ? "text-emerald-800" : "text-amber-800"
                              }`}>{card.val}</span>
                              <span className="text-[7px] text-emerald-600 font-bold mt-0.5 block">{card.desc}</span>
                            </div>
                          ))}
                        </div>

                        {/* Chart simulator representation */}
                        <div className="h-16 bg-white rounded-lg border border-slate-200 p-2 flex items-end gap-1 overflow-hidden relative">
                          <span className="absolute top-1.5 left-2 text-[8px] text-slate-400 uppercase font-mono font-medium">Gráfico Tático</span>
                          <div className={`w-full bg-slate-100 rounded-t h-[30%] border-t ${p3Theme === "indigo" ? "border-indigo-500 bg-indigo-50" : p3Theme === "emerald" ? "border-emerald-500 bg-emerald-50" : "border-slate-400"}`}></div>
                          <div className={`w-full bg-slate-100 rounded-t h-[55%] border-t ${p3Theme === "indigo" ? "border-indigo-500 bg-indigo-100/55" : p3Theme === "emerald" ? "border-emerald-500 bg-emerald-100/55" : "border-slate-400"}`}></div>
                          <div className={`w-full bg-slate-100 rounded-t h-[40%] border-t ${p3Theme === "indigo" ? "border-indigo-500 bg-indigo-50" : p3Theme === "emerald" ? "border-emerald-500 bg-emerald-50" : "border-slate-400"}`}></div>
                          <div className={`w-full bg-slate-100 rounded-t h-[80%] border-t ${p3Theme === "indigo" ? "border-indigo-500 bg-indigo-100/80" : p3Theme === "emerald" ? "border-emerald-500 bg-emerald-100/80" : "border-slate-400"}`}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIMULATOR 4: TESTAGEM RIGOROSA */}
                  {currentStepData.number === 4 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Nenhum painel da Data4Moz entra em produção sem passar pelo nosso rigoroso motor de testes de QA. Dispare a nossa consola de ensaios em tempo real para auditar chaves, velocidades, integridades e políticas de segurança:
                      </p>

                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-700 font-semibold">Estado da Suite: <strong className={qaStatus === "success" ? "text-emerald-600" : "text-amber-600"}>{qaStatus.toUpperCase()}</strong></span>
                        <button
                          onClick={startQATestSimulation}
                          disabled={isQAtesting}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          {isQAtesting ? <RefreshCw className="h-3 w-3 animate-spin text-slate-400" /> : <Play className="h-3 w-3" />}
                          {qaStatus === "idle" ? "Iniciar Testes" : isQAtesting ? "Testando..." : "Testar Novamente"}
                        </button>
                      </div>

                      {/* Code Terminal Output style */}
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-[10px] min-h-[140px] max-h-[160px] overflow-y-auto shadow-inner">
                        {qaLogs.length === 0 ? (
                          <span className="text-slate-500 block text-center mt-8 italic">// Clique em 'Iniciar Testes' para rodar a suíte...</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {qaLogs.map((log, i) => (
                              <div key={i} className={`flex items-start gap-1 ${
                                log.includes("Alerta:") ? "text-amber-400" :
                                log.includes("Sucesso:") ? "text-emerald-400 font-bold" :
                                log.includes("FIM") ? "text-blue-400 font-black border-t border-slate-800 pt-1 mt-1" : "text-slate-300"
                              }`}>
                                <span className="text-slate-500">$&gt;</span>
                                <p>{log}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {isQAtesting && (
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${qaProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SIMULATOR 5: SEGURANÇA & PERFIS */}
                  {currentStepData.number === 5 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Configure a segurança ao nível de linha (Row-Level Security) em tempo real. Escolha um perfil abaixo para ver como o banco de dados masca colunas sensíveis (Margens, Clientes) ou oculta linhas de outras províncias instantaneamente:
                      </p>

                      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200">
                        {[
                          { id: "admin", name: "Administrador / CFO" },
                          { id: "manager_sofala", name: "Supervisor Sofala" },
                          { id: "operator_maputo", name: "Operador Maputo" }
                        ].map((role) => (
                          <button
                            key={role.id}
                            onClick={() => setP5Role(role.id as any)}
                            className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer text-center border ${
                              p5Role === role.id 
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                                : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                            }`}
                          >
                            {role.name}
                          </button>
                        ))}
                      </div>

                      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold">
                          <span>REGISTROS FILTRADOS PELO BANCO:</span>
                          <span className="text-blue-600 font-bold">{filteredSecurityRows.length} linhas visíveis</span>
                        </div>
                        <div className="overflow-x-auto max-h-[140px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-[9px] uppercase font-mono text-slate-500 bg-slate-50">
                                <th className="p-2.5 font-bold">ID</th>
                                <th className="p-2.5 font-bold">Província</th>
                                <th className="p-2.5 font-bold">Valor</th>
                                <th className="p-2.5 font-bold">Margem</th>
                                <th className="p-2.5 font-bold">Cliente</th>
                              </tr>
                            </thead>
                            <tbody className="text-[10px] font-mono text-slate-700">
                              {filteredSecurityRows.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                                  <td className="p-2.5 font-bold text-blue-600">{row.transacao}</td>
                                  <td className="p-2.5 font-semibold">{row.regiao}</td>
                                  <td className="p-2.5">{row.valor}</td>
                                  <td className={`p-2.5 font-bold ${row.margem === "RESTRITO" ? "text-red-500 font-medium italic" : "text-slate-800"}`}>
                                    {row.margem}
                                  </td>
                                  <td className={`p-2.5 ${row.cliente === "CONFIDENCIAL" ? "text-slate-400 italic" : "text-slate-700 font-medium"}`}>
                                    {row.cliente}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SIMULATOR 6: LAUNCH & SUPORTE */}
                  {currentStepData.number === 6 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mantenha o controlo total de produção. Visualize a telemetria ao vivo da infraestrutura cloud da Data4Moz, monitorizando cargas de CPU, uso de memória ram, latência média das queries e logs de segurança em tempo real:
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                          <span className="text-[8px] font-bold uppercase font-mono text-slate-500 block">CPU Utilização</span>
                          <span className="text-lg font-black font-mono text-blue-600 mt-1 block">{sysCpu}%</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                          <span className="text-[8px] font-bold uppercase font-mono text-slate-500 block">RAM Alocada</span>
                          <span className="text-lg font-black font-mono text-indigo-600 mt-1 block">{sysMem}%</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                          <span className="text-[8px] font-bold uppercase font-mono text-slate-500 block">Latência DB</span>
                          <span className="text-lg font-black font-mono text-emerald-600 mt-1 block">{sysLatency}ms</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 font-mono text-[9px] min-h-[100px] max-h-[110px] overflow-y-auto flex flex-col gap-1 select-none shadow-inner">
                        <span className="text-slate-500 mb-1 border-b border-slate-800 pb-1 font-bold block">// LOGS DO SERVIDOR ATIVOS EM TEMPO REAL:</span>
                        {logsList.map((log, i) => (
                          <div key={i} className={`flex items-start gap-1 leading-normal ${
                            log.includes("WARN") ? "text-red-400 font-bold" :
                            log.includes("SYSTEM") ? "text-blue-400 font-bold" : "text-slate-300"
                          }`}>
                            <span>[MZ-CLOUD-1]</span>
                            <p>{log}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: DEMONSTRAÇÃO INTERATIVA (MOCKS VIVOS / SCREENSHOTS SIMULATOR) */}
        {activeTab === "demonstracao" && (
          <div className="flex flex-col gap-6" id="demo-dashboards-view">
            
            {/* Dashboard Showcase Intro */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layout className="text-blue-600 h-5 w-5" />
                  Visualizadores de Demonstração ("Screenshots" Vivos)
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Não mostramos imagens estáticas. Desenvolvemos estes 3 protótipos totalmente interativos para provar a nossa qualidade visual, interatividade e rapidez.
                </p>
              </div>

              {/* Demo Switcher Buttons */}
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveDemo("vendas")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeDemo === "vendas" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Faturação Comercial
                </button>
                <button
                  onClick={() => setActiveDemo("logistica")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeDemo === "logistica" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Logística & SLA
                </button>
                <button
                  onClick={() => setActiveDemo("financeiro")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeDemo === "financeiro" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Performance P&L
                </button>
              </div>
            </div>

            {/* HIGH FIDELITY INTERACTIVE SAMPLE CANVAS */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md p-6 relative">
              
              {/* DEMO 1: VENDAS E FATURAÇÃO COMERCIAL */}
              {activeDemo === "vendas" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Interactive Filters Panel */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                      Filtros Dinâmicos de Simulação:
                    </div>
                    
                    <div className="grid grid-cols-1 sm:flex sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Region Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Província</label>
                        <select 
                          value={vendasFilterRegion} 
                          onChange={(e) => setVendasFilterRegion(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Todas">Moçambique (Todas)</option>
                          <option value="Maputo Cidade">Maputo Cidade (45%)</option>
                          <option value="Sofala (Beira)">Sofala - Beira (25%)</option>
                          <option value="Nampula">Nampula (18%)</option>
                          <option value="Outras Províncias">Outras Províncias (12%)</option>
                        </select>
                      </div>

                      {/* Period Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Período Temporal</label>
                        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                          {[
                            { label: "30D", val: "30" },
                            { label: "90D", val: "90" },
                            { label: "1 Ano", val: "365" }
                          ].map((t) => (
                            <button
                              key={t.val}
                              onClick={() => setVendasFilterPeriod(t.val)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                vendasFilterPeriod === t.val ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Channel Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Canal de Distribuição</label>
                        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                          {[
                            { label: "Todos", val: "Todos" },
                            { label: "Lojas", val: "Retalho" },
                            { label: "B2B", val: "B2B" }
                          ].map((c) => (
                            <button
                              key={c.val}
                              onClick={() => setVendasFilterChannel(c.val)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                vendasFilterChannel === c.val ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Faturação Comercial</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {dynamicSalesMetrics.faturacao.toLocaleString("pt-PT")} MT
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono">
                        <TrendingUp className="h-3 w-3" /> +14.8% vs mês anterior
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Volume de Vendas</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {dynamicSalesMetrics.transacoes.toLocaleString("pt-PT")}
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono">
                        <TrendingUp className="h-3 w-3" /> +8.2% transações
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ticket Médio</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {dynamicSalesMetrics.ticket.toLocaleString("pt-PT")} MT
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono">
                        <TrendingUp className="h-3 w-3" /> +6.1% médio
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Margem Média Geral</span>
                      <h3 className="text-2xl font-black text-blue-600 mt-1">
                        {dynamicSalesMetrics.margem}%
                      </h3>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-medium font-mono">
                        Metas {vendasFilterChannel === "Todos" ? "globais" : vendasFilterChannel.toLowerCase()} ativas
                      </span>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Area Chart - Revenue Trend */}
                    <div className="lg:col-span-8 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Evolução Mensal de Faturação & Custos</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Valores filtrados: {vendasFilterRegion} · {vendasFilterChannel} · {vendasFilterPeriod}D</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">MZN (MT)</span>
                      </div>
                      
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicSalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorCustos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="vendas" name="Vendas Consolidadas" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorVendas)" />
                            <Area type="monotone" dataKey="custo" name="Custo Mercadoria" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCustos)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart - Regional Sales */}
                    <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-900">Distribuição por Província (%)</h4>
                      
                      <div className="h-44 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={salesByRegion}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {salesByRegion.map((entry, index) => {
                                const isSelected = vendasFilterRegion === "Todas" || entry.name.toLowerCase().includes(vendasFilterRegion.split(" ")[0].toLowerCase());
                                return (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    opacity={isSelected ? 1.0 : 0.25}
                                    stroke={isSelected ? "#1e293b" : "#f1f5f9"}
                                    strokeWidth={isSelected ? 1.5 : 0.5}
                                  />
                                );
                              })}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center text-center">
                          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                            {vendasFilterRegion === "Todas" ? "GLOBAL" : vendasFilterRegion.split(" ")[0]}
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            {vendasFilterRegion === "Todas" ? "100%" : 
                             vendasFilterRegion === "Maputo Cidade" ? "45%" :
                             vendasFilterRegion === "Sofala (Beira)" ? "25%" :
                             vendasFilterRegion === "Nampula" ? "18%" : "12%"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        {salesByRegion.map((item, i) => {
                          const isSelected = vendasFilterRegion === "Todas" || item.name.toLowerCase().includes(vendasFilterRegion.split(" ")[0].toLowerCase());
                          return (
                            <button 
                              key={i} 
                              onClick={() => {
                                if (item.name.includes("Maputo")) setVendasFilterRegion("Maputo Cidade");
                                else if (item.name.includes("Sofala")) setVendasFilterRegion("Sofala (Beira)");
                                else if (item.name.includes("Nampula")) setVendasFilterRegion("Nampula");
                                else setVendasFilterRegion("Outras Províncias");
                              }}
                              className={`flex items-center justify-between text-xs px-2 py-1 rounded-md transition-all cursor-pointer ${
                                isSelected ? "bg-white/80 font-semibold shadow-sm text-slate-900 border border-slate-200/50" : "text-slate-400 opacity-60 hover:opacity-90"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                <span>{item.name}</span>
                              </div>
                              <span className="font-mono">{item.value}%</span>
                            </button>
                          );
                        })}
                        {vendasFilterRegion !== "Todas" && (
                          <button 
                            onClick={() => setVendasFilterRegion("Todas")}
                            className="text-[10px] text-blue-600 font-bold text-center mt-1 cursor-pointer hover:underline"
                          >
                            Resetar Filtro Regional
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* DEMO 2: LOGÍSTICA & SLA */}
              {activeDemo === "logistica" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Status filter bar */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Painel Operacional de Frotas:
                    </div>
                    
                    <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                      {[
                        { label: "Todas as Rotas", val: "Todas" },
                        { label: "Em Trânsito", val: "Em Trânsito" },
                        { label: "Atrasadas", val: "Atrasadas" },
                        { label: "Entregues", val: "Entregues" }
                      ].map((st) => (
                        <button
                          key={st.val}
                          onClick={() => {
                            setLogisticaFilterStatus(st.val);
                            // Auto select first matching route
                            const matching = routesData.filter(r => {
                              if (st.val === "Todas") return true;
                              if (st.val === "Em Trânsito") return r.status === "Em Trânsito";
                              if (st.val === "Atrasadas") return r.status.startsWith("Atrasado");
                              if (st.val === "Entregues") return r.status === "Entregue";
                              return true;
                            });
                            if (matching.length > 0) {
                              setLogisticaSelectedRoute(matching[0]);
                            } else {
                              setLogisticaSelectedRoute(null);
                            }
                          }}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            logisticaFilterStatus === st.val ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logistics metrics cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Remessas Totais</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {logisticaFilterStatus === "Todas" ? "895" : 
                         logisticaFilterStatus === "Em Trânsito" ? "320" :
                         logisticaFilterStatus === "Atrasadas" ? "42" : "533"}
                      </h3>
                      <span className="text-[10px] text-slate-500 mt-1 block font-medium font-mono">Registrados na última semana</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Taxa de SLA Geral</span>
                      <h3 className="text-2xl font-black text-emerald-600 mt-1">
                        {logisticaFilterStatus === "Atrasadas" ? "78.4%" : "92.2%"}
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1 font-mono">
                        <Check className="h-3 w-3" /> Alvo mínimo (90%)
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tempo de Despacho Médio</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">1.8 Horas</h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1 font-mono">
                        -12 min de melhoria operacional
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Veículos Ativos na Rota</span>
                      <h3 className="text-2xl font-black text-blue-600 mt-1">34 Camiões</h3>
                      <span className="text-[10px] text-slate-500 mt-1 block font-medium font-mono">Monitorizados via satélite</span>
                    </div>
                  </div>

                  {/* Weekly dispatch volume vs delays chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Active drivers / routes list simulation */}
                    <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Monitor de Rotas Ativas</h4>
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{dynamicRoutes.length} ENCONTRADAS</span>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1">
                        {dynamicRoutes.map((rot, idx) => {
                          const isSelected = logisticaSelectedRoute?.id === rot.id;
                          return (
                            <button
                              key={rot.id}
                              onClick={() => setLogisticaSelectedRoute(rot)}
                              className={`text-left p-3 rounded-xl border flex flex-col gap-1.5 text-xs transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-emerald-50 border-emerald-300 shadow-md ring-1 ring-emerald-400/50" 
                                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-mono font-bold ${isSelected ? "text-emerald-700" : "text-blue-600"}`}>
                                  {rot.id}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  rot.status === "Entregue" ? "bg-emerald-500/10 text-emerald-600" :
                                  rot.status.includes("Atrasado") ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"
                                }`}>
                                  {rot.status}
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-700">
                                <span className="font-bold">{rot.dest}</span>
                                <span className="text-slate-500 font-medium">{rot.driver}</span>
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono text-right border-t border-slate-100 pt-1.5 font-medium flex justify-between">
                                <span>Distância: {rot.km} km</span>
                                <span className={rot.status.includes("Atrasado") ? "text-red-500 font-bold" : "text-emerald-600"}>
                                  {rot.delay}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                        {dynamicRoutes.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-400">
                            Nenhuma rota ativa com este status.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-8 flex flex-col gap-6">
                      
                      {/* Live inspector panel of selected route */}
                      {logisticaSelectedRoute && (
                        <div className="bg-emerald-950/5 border border-emerald-500/20 p-5 rounded-2xl flex flex-col gap-4 shadow-sm animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded">
                                {logisticaSelectedRoute.id}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">
                                Inspetor de SLA de Rota em Tempo Real
                              </h4>
                            </div>
                            <button 
                              onClick={() => setLogisticaSelectedRoute(null)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase cursor-pointer"
                            >
                              fechar x
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Motorista</span>
                              <span className="font-bold text-slate-800">{logisticaSelectedRoute.driver}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Tipo de Carga</span>
                              <span className="font-medium text-slate-700">{logisticaSelectedRoute.carga}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Distância</span>
                              <span className="font-bold text-slate-800">{logisticaSelectedRoute.km} KM</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Sinal de Telemetria</span>
                              <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                {logisticaSelectedRoute.trackerStatus}
                              </span>
                            </div>
                          </div>

                          {/* Visual Route Progress Tracker */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                              <span>PARTIDA</span>
                              <span>PONTO OPERACIONAL ATIVO</span>
                              <span>DESTINO FINAL</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                              {/* progress background line */}
                              <div className="absolute left-0 right-0 h-1.5 bg-slate-100 rounded-full"></div>
                              {/* actual progress line */}
                              <div 
                                className="absolute left-0 h-1.5 bg-emerald-500 rounded-full transition-all duration-700" 
                                style={{ 
                                  width: logisticaSelectedRoute.status === "Entregue" ? "100%" : 
                                         logisticaSelectedRoute.status.includes("Atrasado") ? "48%" : "65%" 
                                }}
                              ></div>
                              
                              {/* Start marker */}
                              <div className="absolute left-0 h-4 w-4 bg-emerald-600 rounded-full border-4 border-white shadow-sm"></div>
                              
                              {/* Truck icon locator */}
                              <div 
                                className="absolute h-8 w-8 bg-slate-900 text-white rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-700"
                                style={{ 
                                  left: logisticaSelectedRoute.status === "Entregue" ? "calc(100% - 16px)" : 
                                        logisticaSelectedRoute.status.includes("Atrasado") ? "calc(48% - 16px)" : "calc(65% - 16px)"
                                }}
                              >
                                <span className="text-[10px] font-bold">🚛</span>
                              </div>

                              {/* End marker */}
                              <div className="absolute right-0 h-4 w-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span className="font-bold text-slate-800">{logisticaSelectedRoute.dest.split(" > ")[0]}</span>
                              <span className="font-mono text-xs font-black text-slate-700">
                                {logisticaSelectedRoute.status === "Entregue" ? "100% Concluído" : 
                                 logisticaSelectedRoute.status.includes("Atrasado") ? "Em Trânsito - 48%" : "Em Trânsito - 65%"}
                              </span>
                              <span className="font-bold text-slate-800">{logisticaSelectedRoute.dest.split(" > ")[1]}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">Remessas Diárias Despachadas vs Atrasos</h4>
                          <span className="text-[10px] text-slate-500 font-mono font-medium">HISTÓRICO SEMANAL</span>
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={logisticData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                              <YAxis stroke="#64748b" fontSize={11} />
                              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }} />
                              <Legend wrapperStyle={{ fontSize: 11 }} />
                              <Bar dataKey="prazos" name="Entregue no Prazo" fill="#10b981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="atrasados" name="Atrasos Detetados" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* DEMO 3: PERFORMANCE FINANCEIRA */}
              {activeDemo === "financeiro" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Financial Interactive Sliders Panel */}
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row items-stretch justify-between gap-6">
                    <div className="flex flex-col gap-1.5 justify-center max-w-sm">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        Simulador de Impacto Financeiro:
                      </span>
                      <p className="text-xs text-slate-500">
                        Ajuste as variáveis de mercado e operação para visualizar o impacto instantâneo no P&L e no gráfico de evolução trimestral.
                      </p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sales growth slider */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-700">Crescimento de Vendas</span>
                          <span className="font-mono font-black text-indigo-600">
                            {financeSimSalesGrowth >= 0 ? "+" : ""}{financeSimSalesGrowth}%
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="-30" 
                          max="50" 
                          step="5"
                          value={financeSimSalesGrowth}
                          onChange={(e) => setFinanceSimSalesGrowth(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                          <span>-30% Recessão</span>
                          <span>0% Estável</span>
                          <span>+50% Expansão</span>
                        </div>
                      </div>

                      {/* Cost Optimization slider */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-700">Redução de Custos (CMV & OpEx)</span>
                          <span className="font-mono font-black text-indigo-600">
                            {financeSimCostOptimization}%
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="30" 
                          step="2"
                          value={financeSimCostOptimization}
                          onChange={(e) => setFinanceSimCostOptimization(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                          <span>0% Base</span>
                          <span>15% Moderada</span>
                          <span>30% Extrema</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial KPI rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">EBITDA Projetado</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {Math.round(2180000 * (1 + (simulatedFinancials.lucroImpact / 310000) * 0.45)).toLocaleString("pt-PT")} MT
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono">
                        {(22.4 * (1 + (simulatedFinancials.lucroImpact / 310000) * 0.15)).toFixed(1)}% margem operacional
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Margem Bruta</span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {simulatedFinancials.margem}%
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono">
                        {simulatedFinancials.margem > 45.5 ? "Melhoria de " + (simulatedFinancials.margem - 45.5).toFixed(1) + " pp" : "Redução de " + Math.abs(simulatedFinancials.margem - 45.5).toFixed(1) + " pp"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Faturação Corrente Anual</span>
                      <h3 className="text-2xl font-black text-indigo-600 mt-1">
                        {Math.round(8420000 * (1 + financeSimSalesGrowth / 100)).toLocaleString("pt-PT")} MT
                      </h3>
                      <span className="text-[10px] text-slate-500 mt-1 block font-medium font-mono">
                        Fórmula base: 8.420.000 MT corrigido
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Impacto Líquido Mensal</span>
                      <h3 className={`text-2xl font-black mt-1 ${simulatedFinancials.lucroImpact >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {simulatedFinancials.lucroImpact >= 0 ? "+" : ""}{simulatedFinancials.lucroImpact.toLocaleString("pt-PT")} MT
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        {simulatedFinancials.lucroImpact >= 0 ? "Ganho operacional extra" : "Perda em relação à base"}
                      </span>
                    </div>
                  </div>

                  {/* Financial charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <div className="lg:col-span-8 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Histórico de Receita, Despesa e Margem Líquida</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Valores simulados ajustados: {financeSimSalesGrowth}% crescimento · {financeSimCostOptimization}% eficiência</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">MZN (MT)</span>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicFinancialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="receita" name="Receita Bruta" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.05} />
                            <Area type="monotone" dataKey="despesa" name="Despesas Totais" stroke="#ef4444" strokeWidth={1.5} fill="#ef4444" fillOpacity={0} />
                            <Area type="monotone" dataKey="margem" name="Margem de Lucro" stroke="#6366f1" strokeWidth={2.5} fill="#6366f1" fillOpacity={0.08} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Demonstration of simple P&L tabular layout */}
                    <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-slate-900">Resultados Operacionais (P&L)</h4>
                        <span className="text-[9px] text-indigo-600 font-mono font-bold uppercase tracking-wider mt-0.5">COMPARAÇÃO LINHA DE BASE vs SIMULADO</span>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2 font-mono text-[9px] text-slate-400 font-bold">
                          <span>RUBRICA</span>
                          <div className="flex gap-4">
                            <span>BASE</span>
                            <span className="text-indigo-600">PROJETADO</span>
                          </div>
                        </div>
                        
                        {/* Receita */}
                        <div className="flex justify-between text-slate-800 font-bold">
                          <span>(+) Receita Bruta</span>
                          <div className="flex gap-4 font-mono">
                            <span className="text-slate-400 font-normal">680k</span>
                            <span className="text-slate-900">{(simulatedFinancials.receita / 1000).toFixed(0)}k MT</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-slate-500 pl-3">
                          <span>• Canal Direto Lojas</span>
                          <div className="flex gap-4 font-mono text-[11px]">
                            <span className="text-slate-300">420k</span>
                            <span>{(simulatedFinancials.direto / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-slate-500 pl-3 border-b border-slate-100 pb-2">
                          <span>• Canal Corp (B2B)</span>
                          <div className="flex gap-4 font-mono text-[11px]">
                            <span className="text-slate-300">260k</span>
                            <span>{(simulatedFinancials.corp / 1000).toFixed(0)}k</span>
                          </div>
                        </div>

                        {/* Custo Mercadorias */}
                        <div className="flex justify-between text-red-600 font-medium">
                          <span>(-) CMV</span>
                          <div className="flex gap-4 font-mono">
                            <span className="text-red-300">-240k</span>
                            <span>{Math.round(simulatedFinancials.cmv / 1000)}k MT</span>
                          </div>
                        </div>

                        {/* Custos Pessoal */}
                        <div className="flex justify-between text-red-600 font-medium border-b border-slate-200 pb-2">
                          <span>(-) Custos com Pessoal</span>
                          <div className="flex gap-4 font-mono">
                            <span className="text-red-300">-130k</span>
                            <span>{Math.round(simulatedFinancials.pessoal / 1000)}k MT</span>
                          </div>
                        </div>

                        {/* Lucro Bruto Final */}
                        <div className="flex justify-between text-emerald-600 font-black text-sm border-b border-slate-200 pb-2">
                          <span>(=) Lucro Bruto</span>
                          <div className="flex gap-4 font-mono text-xs font-black">
                            <span className="text-emerald-300 font-normal">310k</span>
                            <span>{(simulatedFinancials.lucro / 1000).toFixed(0)}k MT</span>
                          </div>
                        </div>

                        {/* Margem */}
                        <div className="flex justify-between text-slate-500 text-[10px] italic">
                          <span>Margem Bruta Estimada</span>
                          <div className="flex gap-4 font-mono font-bold">
                            <span className="text-slate-400">45.5%</span>
                            <span className="text-indigo-600">{simulatedFinancials.margem}%</span>
                          </div>
                        </div>

                        {/* Reset button */}
                        {(financeSimSalesGrowth !== 10 || financeSimCostOptimization !== 5) && (
                          <button 
                            onClick={() => {
                              setFinanceSimSalesGrowth(10);
                              setFinanceSimCostOptimization(5);
                            }}
                            className="text-[10px] text-indigo-600 font-bold text-center mt-2 cursor-pointer hover:underline"
                          >
                            Resetar Parâmetros de Simulação
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}
        {false && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ai-proposal-view">
            
            {/* Input Form Wizard */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-blue-600 h-5 w-5" />
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Configurador de Dashboard & IA</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">
                  Insira o nome da sua empresa, setor e desafios de dados reais. O nosso motor de inteligência artificial construirá um roteiro completo de desenvolvimento personalizado, com sugestões de segurança, tabelas de banco e cronograma.
                </p>

                {/* Pre-fill Helpers */}
                <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold font-mono uppercase text-slate-500 block mb-2">Simular exemplos rápidos:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => prefillAIProposal("vendas")}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[10px] font-bold text-blue-600 rounded border border-slate-200 flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <Briefcase className="h-3 w-3" /> Exemplo Vendas
                    </button>
                    <button
                      type="button"
                      onClick={() => prefillAIProposal("logistica")}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[10px] font-bold text-blue-600 rounded border border-slate-200 flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <TrendingUp className="h-3 w-3" /> Exemplo Logística
                    </button>
                    <button
                      type="button"
                      onClick={() => prefillAIProposal("saude")}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[10px] font-bold text-blue-600 rounded border border-slate-200 flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <Users className="h-3 w-3" /> Exemplo Saúde
                    </button>
                  </div>
                </div>

                <form onSubmit={handleGenerateProposalSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Nome da Empresa Cliente</label>
                    <input
                      type="text"
                      value={proposalForm.companyName}
                      onChange={(e) => setProposalForm({ ...proposalForm, companyName: e.target.value })}
                      placeholder="ex: Moçambique Comercial Lda"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Setor Industrial / Foco</label>
                    <select
                      value={proposalForm.industry}
                      onChange={(e) => setProposalForm({ ...proposalForm, industry: e.target.value as IndustryType })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="vendas">Vendas & Faturação de Retalho</option>
                      <option value="logistica">Logística, Frotas & SLA</option>
                      <option value="saude">Saúde, Pacientes & Clínicas</option>
                      <option value="financeiro">Financeiro, P&L & Despesas</option>
                      <option value="outro">Outro Setor Empresarial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Fontes de Dados (Sistemas / Planilhas)</label>
                    <input
                      type="text"
                      value={proposalForm.dataSource}
                      onChange={(e) => setProposalForm({ ...proposalForm, dataSource: e.target.value })}
                      placeholder="ex: Sage Primavera, 3 planilhas Excel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Dores de Gestão & Metas de Negócio</label>
                    <textarea
                      value={proposalForm.challenges}
                      onChange={(e) => setProposalForm({ ...proposalForm, challenges: e.target.value })}
                      placeholder="Descreva o problema de dados ou o que deseja visualizar..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingProposal}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase"
                  >
                    {isGeneratingProposal ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-white" />
                    )}
                    {isGeneratingProposal ? "A Processar com Gemini..." : "Gerar Roteiro Técnico IA"}
                  </button>
                </form>
              </div>
            </div>

            {/* Generated Proposal / Outputs */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              <AnimatePresence mode="wait">
                {isGeneratingProposal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center min-h-[400px]"
                  >
                    <div className="relative mb-6">
                      <div className="h-16 w-16 rounded-full border-2 border-blue-500/20 border-t-blue-600 animate-spin"></div>
                      <Sparkles className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">Construindo Diagnóstico Customizado</h4>
                    <p className="text-xs text-slate-500 max-w-xs">{loadingStep}</p>
                    
                    <div className="mt-8 flex gap-1 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0s" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                    </div>
                  </motion.div>
                )}

                {!isGeneratingProposal && !proposalResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50/50 border border-dashed border-slate-300 rounded-3xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center text-slate-500"
                  >
                    <Sparkles className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-sm font-bold text-slate-700">Aguardando Parâmetros de Entrada</p>
                    <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">Preencha o formulário e clique em 'Gerar Roteiro Técnico' para ver a nossa proposta comercial e engenharia de dados à medida.</p>
                  </motion.div>
                )}

                {!isGeneratingProposal && proposalResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-6"
                  >
                    {/* Proposal Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                          Proposta Técnica Autogerada
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">Plano Estratégico de BI: {proposalForm.companyName}</h3>
                        <p className="text-xs text-slate-500">Mapeamento robusto desenhado pela equipe da Data4Moz</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={copyProposalToClipboard}
                          className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          {copiedNotification ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Download className="h-3.5 w-3.5 text-slate-500" />}
                          {copiedNotification ? "Copiado!" : "Copiar Proposta"}
                        </button>
                      </div>
                    </div>

                    {/* Proposal Sections Accordion style or split */}
                    <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2">
                      
                      {/* Section 1: Data Model */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 text-blue-600 mb-3">
                          <Database className="h-4.5 w-4.5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">1. Mapeamento de Tabela & Tipagem</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {proposalResult.fields && proposalResult.fields.map((f, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs gap-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="font-mono text-blue-600 font-bold">{f.name}</span>
                                <span className="text-slate-600 text-[11px] mt-0.5 font-medium">{f.description}</span>
                              </div>
                              <div className="flex items-center gap-2 justify-between sm:justify-end">
                                <span className="font-mono text-slate-500 text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{f.type}</span>
                                <span className="text-slate-600 text-[11px] italic font-semibold">Ex: {f.sample}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 2: Recommended charts */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 text-indigo-600 mb-3">
                          <Layout className="h-4.5 w-4.5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">2. Design & Organização do Ecrã</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {proposalResult.recommendedCharts && proposalResult.recommendedCharts.map((c, i) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
                              <span className="font-extrabold text-slate-900 block">{c.chartType}</span>
                              <span className="text-slate-600 block mt-1 font-semibold">{c.description}</span>
                              <p className="text-slate-500 text-[11px] mt-1.5 italic border-t border-slate-100 pt-1.5 leading-relaxed">
                                <strong>Justificação:</strong> {c.rationale}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 3: Security */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 text-emerald-600 mb-3">
                          <ShieldCheck className="h-4.5 w-4.5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">3. Segurança Dinâmica de Linhas (RLS)</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {proposalResult.securityLevels && proposalResult.securityLevels.map((s, i) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center shadow-sm">
                              <div>
                                <span className="font-extrabold text-slate-900 block">{s.role}</span>
                                <span className="text-slate-600 text-[11px] mt-0.5 font-medium">{s.scope}</span>
                              </div>
                              <span className="text-[10px] font-bold font-mono bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">
                                {s.accessType}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: Implementation Timeline */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 text-amber-600 mb-3">
                          <Clock className="h-4.5 w-4.5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">4. Cronograma de Implementação (Fases)</h4>
                        </div>

                        <div className="flex flex-col gap-3 relative pl-3 border-l border-slate-200">
                          {proposalResult.implementationTimeline && proposalResult.implementationTimeline.map((t, i) => (
                            <div key={i} className="relative text-xs">
                              <div className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-amber-500"></div>
                              <div className="flex justify-between font-extrabold text-slate-900">
                                <span>{t.phase}</span>
                                <span className="text-amber-600 font-mono text-[10px]">{t.duration}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {t.deliverables && t.deliverables.map((del, dIdx) => (
                                  <span key={dIdx} className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                                    {del}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 5: Estimated Resources */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                          <Users className="h-4.5 w-4.5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">5. Recursos Técnicos & Equipa Sugerida</h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-semibold">
                          {proposalResult.estimatedResources}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-10 px-4 sm:px-6 text-slate-500" id="footer-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={data4mozLogo} 
              alt="Data4Moz Logo" 
              className="h-8 w-8 object-contain rounded-full border border-slate-100"
              referrerPolicy="no-referrer" 
            />
            <div>
              <p className="font-bold text-slate-800 text-sm">Data4Moz Lda.</p>
              <p className="text-[10px] text-slate-400 font-medium">Business Intelligence & Engenharia de Dados de Alta Performance</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-xs">
            <div className="flex gap-4">
              <span className="hover:text-slate-800 transition-colors cursor-pointer font-medium">Segurança de Dados</span>
              <span className="hover:text-slate-800 transition-colors cursor-pointer font-medium">SLA & Suporte</span>
              <span className="hover:text-slate-800 transition-colors cursor-pointer font-medium">Contacto Direto</span>
            </div>
            <p className="text-[11px] text-slate-400 text-center md:text-right font-medium">© 2026 Data4Moz Lda. Maputo, Moçambique. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
