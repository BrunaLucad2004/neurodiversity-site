import AboutUsLayout from "../../AboutUsLayout";
import "./Contact.css";

const equipe = [
  {
    nome: "Lucyanne de Melo Afonso",
    cargo: "Diretora do CEDOMCA",
    email: "lucyanne@ufam.edu.br",
    foto: "lucyanne.jpeg",
  },
  {
    nome: "João Gustavo Kienen",
    cargo: "Diretor do CEDOMCA",
    email: "joao@ufam.edu.br",
    foto: "joao.jpeg",
  },
  {
    nome: "Fernando Alves Matos",
    cargo: "Apoio Operacional",
    email: "fernandoalves@ufam.edu.br",
    foto: "fernando_alves.jpeg",
  },
  {
    nome: "Rosiel Mendonça",
    cargo: "Apoio Operacional",
    email: "rosielmendonca@ufam.edu.br",
    foto: "rosiel_mendonca.jpg",
  },
  {
    nome: "Danielle Colares",
    cargo: "Aluna pesquisadora",
    email: "danielle@ufam.edu.br",
    foto: "danielle.jpeg",
  },
  {
    nome: "Darc Anne Ferreira",
    cargo: "Aluna pesquisadora",
    email: "darcanne@ufam.edu.br",
    foto: "darc_anne.jpeg",
  },
  {
    nome: "Ester Gama",
    cargo: "Aluna pesquisadora",
    email: "estergama@ufam.edu.br",
    foto: "ester_gama.jpeg",
  },
  {
    nome: "João Pedro Soares Santiago",
    cargo: "Aluno pesquisador",
    email: "joaopedro@ufam.edu.br",
    foto: "joao_pedro.jpeg",
  },
  {
    nome: "Joelina Sulamita Leite Nunes",
    cargo: "Aluna pesquisadora",
    email: "joelina@ufam.edu.br",
    foto: "joelina_sulamita.jpeg",
  },
  {
    nome: "Julieni Soares Galvão",
    cargo: "Aluna pesquisadora",
    email: "julieni@ufam.edu.br",
    foto: "julieni_soares.jpeg",
  },
  {
    nome: "Laura Ferreira Andrade",
    cargo: "Aluna pesquisadora",
    email: "laura@ufam.edu.br",
    foto: "laura_ferreira.jpeg",
  },
  {
    nome: "Sandy Heloisa",
    cargo: "Aluna pesquisadora",
    email: "sandy@ufam.edu.br",
    foto: "sandy_heloisa.jpeg",
  },
];

export default function Contact() {
  return (
    <AboutUsLayout activePage="contato">
      <main className="home-main">
        <h1 className="contact-page-title">Contato</h1>

        {/* Equipe */}
        <section className="contact-section">
          <h2 className="contact-section-title">Equipe</h2>
          <div className="contact-grid">
            {equipe.map((pessoa, i) => (
              <article className="contact-card" key={i}>
                <div className="contact-avatar">
                  <img 
                    src={`${process.env.PUBLIC_URL}/${pessoa.foto}`} 
                    alt={pessoa.nome} 
                    className="contact-photo"
                  />
                </div>
                <div className="contact-info">
                  <span className="contact-nome">{pessoa.nome}</span>
                  <span className="contact-cargo">{pessoa.cargo}</span>
                  <span className="contact-email">
                    <svg
                      className="email-icon"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="16"
                        height="12"
                        rx="2"
                        stroke="#888"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M2 7l8 5 8-5"
                        stroke="#888"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    {pessoa.email}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Localização */}
        <section className="contact-localizacao-card">
          <h2 className="contact-localizacao-title">Localização</h2>
          <p className="contact-localizacao-text">
            <strong>Endereço:</strong> Faculdade de Artes - Universidade Federal
            do Amazonas (UFAM)
          </p>
          <p className="contact-localizacao-text">
            Rua das Artes, 1000 - Campus Universitário
          </p>
          <p className="contact-localizacao-text">
            Araraquara - SP, CEP 14800-000
          </p>
          <p className="contact-localizacao-text contact-localizacao-email">
            <strong>E-mail Institucional:</strong> cedomca@ufar.edu.br
          </p>
        </section>
      </main>
    </AboutUsLayout>
  );
}
