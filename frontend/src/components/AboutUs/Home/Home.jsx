import AboutUsLayout from "../../AboutUsLayout";

const acervoItems = [
  {
    categoria: "Música",
    categoriaClass: "tag-musica",
    periodo: "1900-1980",
    titulo: "Partituras Históricas",
    descricao:
      "Coleção de partituras originais do século XIX e XX, incluindo composições regionais.",
    quantidade: "230 peças",
  },
  {
    categoria: "Áudio",
    categoriaClass: "tag-audio",
    periodo: "1930-2000",
    titulo: "Documentos Sonoros",
    descricao:
      "Gravações históricas em diversos formatos: fitas cassete, discos de vinil e CDs.",
    quantidade: "450 registros",
  },
  {
    categoria: "Visual",
    categoriaClass: "tag-visual",
    periodo: "1920-1995",
    titulo: "Fotografias",
    descricao:
      "Acervo fotográfico de eventos culturais, artistas e patrimônio histórico de Araraquara.",
    quantidade: "1.200 fotografias",
  },
  {
    categoria: "Arquivo",
    categoriaClass: "tag-arquivo",
    periodo: "1930-1979",
    titulo: "Conservatório Musical Joaquim Franco",
    descricao:
      "Documentação completa do Conservatório Musical (1930-1979), incluindo programas, certificados e registros administrativos.",
    quantidade: "500+ documentos",
  },
  {
    categoria: "Bibliografia",
    categoriaClass: "tag-bibliografia",
    periodo: "1950-2020",
    titulo: "Biblioteca Especializada",
    descricao:
      "Livros e periódicos sobre música, cultura e história regional de Araraquara.",
    quantidade: "800 volumes",
  },
  {
    categoria: "Vídeo",
    categoriaClass: "tag-video",
    periodo: "1970-2010",
    titulo: "Material Audiovisual",
    descricao:
      "Vídeos de apresentações, entrevistas com artistas e documentários sobre cultura regional.",
    quantidade: "150 registros",
  },
];

export default function Home() {
  return (
    <AboutUsLayout activePage="acervo">
      <main className="home-main">
        {/* Intro Card */}
        <section className="home-intro-card">
          <h1 className="home-intro-title">Acervo de Artes CEDOMCA</h1>
          <p className="home-intro-text">
            Bem-vindo  Laboratório e Centro de Documentação e Memória da Cultura na Amazônia
            (CEDOMCA), o acervo da Faculdade de Artes da
            Universidade Federal do Amazonas (UFAM).
          </p>
          <p className="home-intro-text">
            O CEDOMCA foi criado em 23 de maio de 1983, com o objetivo de reunir
            e salvaguardar a memória da cultura amazônica. Funciona como
            arquivo, biblioteca e fonoteca, preservando documentos sonoros,
            audiovisuais e bibliográficos essenciais para pesquisa acadêmica e
            artística.
          </p>
        </section>

        {/* Grid */}
        <section className="home-grid-section">
          <h2 className="home-grid-title">Explore o Acervo</h2>
          <div className="home-grid">
            {acervoItems.map((item, i) => (
              <article className="home-card" key={i}>
                <div className="home-card-header">
                  <span className={`home-tag ${item.categoriaClass}`}>
                    {item.categoria}
                  </span>
                  <span className="home-card-periodo">{item.periodo}</span>
                </div>
                <h3 className="home-card-title">{item.titulo}</h3>
                <p className="home-card-desc">{item.descricao}</p>
                <span className="home-card-qty">{item.quantidade}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AboutUsLayout>
  );
}
