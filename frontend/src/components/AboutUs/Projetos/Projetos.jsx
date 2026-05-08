import AboutUsLayout from "../../AboutUsLayout";
import "./Projetos.css";

const projetos = [
  {
    financiador: "PIBIC",
    financiadorClass: "badge-pibic",
    periodo: "2024-2025",
    titulo: "Mapeamento do Patrimônio Musical da Amazônia",
    coordenacao: "Prof. Dr. João Gustavo Kienen",
    descricao:
      "Levantamento e catalogação de manifestações musicais tradicionais e contemporâneas da região amazônica, com foco em comunidades ribeirinhas e povos originários.",
    objetivos: [
      "Identificar e registrar repertórios musicais em comunidades amazônicas",
      "Construir base de dados digital do patrimônio musical levantado",
      "Promover acesso público ao acervo via plataforma online",
    ],
  },
  {
    financiador: "FAPEAM",
    financiadorClass: "badge-fapeam",
    periodo: "2023-2025",
    titulo: "Digitalização e Preservação do Acervo Documental CEDOMCA",
    coordenacao: "Profa. Dra. Lucyanne de Melo Afonso",
    descricao:
      "Projeto voltado para a digitalização, indexação e preservação de documentos históricos do CEDOMCA, garantindo a longevidade e o acesso ao acervo cultural amazônico.",
    objetivos: [
      "Digitalizar documentos sonoros, audiovisuais e bibliográficos do acervo",
      "Desenvolver sistema de gestão e consulta do acervo digital",
      "Capacitar equipe para manutenção e expansão do acervo digitalizado",
    ],
  },
];

export default function Projetos() {
  return (
    <AboutUsLayout activePage="projetos">
      <main className="home-main">
        {/* Hero Card */}
        <section className="home-intro-card">
          <h1 className="home-intro-title">Projetos de Pesquisa</h1>
          <p className="home-intro-text">
            O CEDOMCA desenvolve projetos de pesquisa voltados para a preservação,
            documentação e difusão do patrimônio cultural e artístico da Amazônia.
            Nossas iniciativas integram pesquisadores, alunos e comunidades em torno
            da memória amazônica.
          </p>
          <p className="home-intro-text">
            Os projetos são financiados por agências de fomento como PIBIC e FAPEAM,
            em parceria com a Universidade Federal do Amazonas (UFAM), promovendo
            pesquisa acadêmica de impacto regional e nacional.
          </p>
        </section>

        {/* Todos os Projetos */}
        <section>
          <h2 className="home-grid-title">Todos os Projetos</h2>
          <div className="projetos-list">
            {projetos.map((projeto, i) => (
              <article className="projetos-card" key={i}>
                <div className="projetos-card-header">
                  <span className={`projetos-badge ${projeto.financiadorClass}`}>
                    {projeto.financiador}
                  </span>
                  <span className="projetos-periodo">{projeto.periodo}</span>
                </div>
                <h3 className="projetos-card-title">{projeto.titulo}</h3>
                <p className="projetos-coordenacao">{projeto.coordenacao}</p>
                <p className="projetos-card-desc">{projeto.descricao}</p>
                <div className="projetos-objetivos">
                  <span className="projetos-objetivos-label">OBJETIVOS</span>
                  <ul className="projetos-objetivos-list">
                    {projeto.objetivos.map((obj, j) => (
                      <li key={j}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AboutUsLayout>
  );
}
