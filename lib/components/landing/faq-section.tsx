import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Quanto custa para iniciar um processo?",
    answer:
      "Nada! Não cobramos nenhum valor antecipado. Você só paga se ganhar o processo, e nossa taxa é descontada do valor da indenização recuperada.",
  },
  {
    question: "Quanto tempo demora um processo?",
    answer:
      "Em média, os processos levam de 6 a 12 meses para serem concluídos. Mantemos você informado em cada etapa do processo.",
  },
  {
    question: "Qual o valor da indenização?",
    answer:
      "O valor varia de acordo com o tipo de problema e a distância do voo. Pode variar de R$ 1.500 a R$ 10.000 ou mais, dependendo do caso.",
  },
  {
    question: "Preciso comparecer ao tribunal?",
    answer:
      "Na maioria dos casos, não. Nossos advogados cuidam de toda a parte jurídica e representam você em todas as audiências.",
  },
  {
    question: "Quais documentos preciso fornecer?",
    answer:
      "Basicamente o bilhete aéreo, documento de identidade e comprovante do problema (declaração de atraso, protocolo de bagagem extraviada, etc.).",
  },
  {
    question: "Posso processar voos antigos?",
    answer: "Sim! Você tem até 5 anos para entrar com uma ação judicial contra a companhia aérea.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4 text-balance">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground text-balance">Tire suas dúvidas sobre nossos serviços</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
