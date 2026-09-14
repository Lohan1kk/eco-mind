"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ANNEX,
  CENTRAL_PROPOSAL,
  DOC_META,
  LUDIC_ACTIVITY,
  PRESENTATION,
  PROJECT_DEV,
  RESEARCH,
  TEAM,
  TOC,
  VISITOR_CHALLENGE,
} from "@/data/documentacao-expoppt";

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-dark no-print !px-5 !py-2.5 text-sm"
    >
      Imprimir / salvar PDF
    </button>
  );
}

function DocSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`doc-section scroll-mt-28 border-b border-[var(--line)] py-12 last:border-b-0 ${className}`}
    >
      {children}
    </section>
  );
}

export function DocumentacaoExpoPT() {
  return (
    <article className="doc-print">
      <div className="doc-cover mb-10 rounded-2xl bg-forest px-6 py-10 text-mist md:px-10 md:py-12">
        <p className="eyebrow text-sprout">{DOC_META.school}</p>
        <h1 className="display mt-4 text-3xl text-mist md:text-5xl">
          {DOC_META.projectName}
        </h1>
        <p className="mt-3 text-lg text-mist/85">{DOC_META.tagline}</p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist/75">
          {DOC_META.event}
          <br />
          {DOC_META.yearLabel}
        </p>
        <p className="mt-4 text-sm font-semibold text-sprout">
          {DOC_META.grade}
        </p>
        <ul className="mt-8 grid gap-2 text-sm text-mist/90 sm:grid-cols-2">
          {TEAM.map((member) => (
            <li key={member.name}>
              <span className="font-semibold text-mist">{member.name}</span>
              <span className="text-mist/65"> — {member.role}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-mist/55">
          Entrega da pesquisa: {DOC_META.deliveryDate} ·{" "}
          <span className="text-mist/80">{DOC_META.siteUrl}</span>
        </p>
      </div>

      <div className="no-print mb-10 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-forest">
            Versão digital e para impressão
          </p>
          <p className="mt-1 text-sm text-ash">
            Leia no site ou use o botão para imprimir / gerar PDF (Classroom e
            encadernação).
          </p>
        </div>
        <PrintButton />
      </div>

      <nav
        aria-label="Índice da documentação"
        className="no-print mb-10 rounded-2xl border border-[var(--line)] bg-mist-soft/80 p-5"
      >
        <p className="eyebrow text-forest-mid">Índice</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {TOC.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm font-medium text-forest hover:underline"
              >
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <DocSection id="capa">
        <h2 className="display text-2xl text-ink md:text-3xl">
          Identificação do trabalho
        </h2>
        <dl className="mt-6 grid gap-4 text-sm leading-relaxed text-ink/90 md:grid-cols-2">
          <div>
            <dt className="font-semibold text-forest">Instituição</dt>
            <dd>{DOC_META.school}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Evento</dt>
            <dd>ExpoPT {DOC_META.year}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Turma</dt>
            <dd>{DOC_META.grade}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Projeto</dt>
            <dd>
              {DOC_META.projectName} — {DOC_META.tagline}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-forest">Tema geral</dt>
            <dd>{DOC_META.theme}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-forest">Foco ODS</dt>
            <dd>{DOC_META.ods}</dd>
          </div>
        </dl>
      </DocSection>

      <DocSection id="proposta">
        <h2 className="display text-2xl text-ink md:text-3xl">
          Proposta central da ExpoPT
        </h2>
        <blockquote className="mt-6 border-l-4 border-sprout-deep pl-5 font-display text-xl leading-snug text-forest md:text-2xl">
          “{CENTRAL_PROPOSAL.question}”
        </blockquote>
        <p className="mt-6 text-base leading-relaxed text-ink/90">
          {CENTRAL_PROPOSAL.answer}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ash">
          <span className="font-semibold text-forest">Problema de partida: </span>
          {CENTRAL_PROPOSAL.problemFocus}
        </p>
      </DocSection>

      <DocSection id="pesquisa">
        <h2 className="display text-2xl text-ink md:text-3xl">
          1. Pesquisa e fundamentação
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ash">
          Pesquisa em grupo sobre desmatamento e queimadas, sua relação com a{" "}
          {DOC_META.ods}, a importância do voluntariado, a participação da
          comunidade e o papel da tecnologia — com exemplos de iniciativas
          reais.
        </p>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          {RESEARCH.introduction.title}
        </h3>
        {RESEARCH.introduction.paragraphs.map((p) => (
          <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-ink/90">
            {p}
          </p>
        ))}

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          {RESEARCH.development.title}
        </h3>
        {RESEARCH.development.sections.map((section) => (
          <div key={section.heading} className="mt-8">
            <h4 className="text-base font-semibold text-ink">
              {section.heading}
            </h4>
            {section.paragraphs.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="mt-3 text-base leading-relaxed text-ink/90"
              >
                {p}
              </p>
            ))}
          </div>
        ))}

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          {RESEARCH.conclusion.title}
        </h3>
        {RESEARCH.conclusion.paragraphs.map((p) => (
          <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-ink/90">
            {p}
          </p>
        ))}

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          4. Referências bibliográficas
        </h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink/90">
          {RESEARCH.references.map((ref) => (
            <li key={ref.text}>{ref.text}</li>
          ))}
        </ol>
      </DocSection>

      <DocSection id="anexo">
        <h2 className="display text-2xl text-ink md:text-3xl">{ANNEX.title}</h2>
        <dl className="mt-6 space-y-5 text-base leading-relaxed text-ink/90">
          <div>
            <dt className="font-semibold text-forest">Tema</dt>
            <dd className="mt-1">{ANNEX.theme}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Objetivo</dt>
            <dd className="mt-1">{ANNEX.objective}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Público-alvo</dt>
            <dd className="mt-1">{ANNEX.audience}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Materiais necessários</dt>
            <dd className="mt-1">
              <ul className="list-disc space-y-1 pl-5">
                {ANNEX.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Passo a passo</dt>
            <dd className="mt-1">
              <ol className="list-decimal space-y-2 pl-5">
                {ANNEX.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">
              Forma de participação dos visitantes
            </dt>
            <dd className="mt-1">{ANNEX.visitorParticipation}</dd>
          </div>
          <div>
            <dt className="font-semibold text-forest">Resultado esperado</dt>
            <dd className="mt-1">{ANNEX.expectedResult}</dd>
          </div>
        </dl>
      </DocSection>

      <DocSection id="ludica">
        <h2 className="display text-2xl text-ink md:text-3xl">
          {LUDIC_ACTIVITY.title}
        </h2>
        <p className="mt-4 text-lg font-semibold text-forest">
          {LUDIC_ACTIVITY.name}
        </p>
        <p className="mt-2 text-sm text-ash">{LUDIC_ACTIVITY.type}</p>
        <p className="mt-6 text-base leading-relaxed text-ink/90">
          <span className="font-semibold text-forest">Relação com o tema: </span>
          {LUDIC_ACTIVITY.relation}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink/90">
          <span className="font-semibold text-forest">Objetivo educativo: </span>
          {LUDIC_ACTIVITY.educationalGoal}
        </p>
        <h3 className="mt-8 text-base font-semibold text-ink">Regras</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-ink/90">
          {LUDIC_ACTIVITY.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <p className="mt-6 text-base leading-relaxed text-ink/90">
          {LUDIC_ACTIVITY.preparedByGroup}
        </p>
        <p className="no-print mt-6">
          <Link href={LUDIC_ACTIVITY.linkPath} className="btn btn-primary text-sm">
            Abrir quiz EcoMind
          </Link>
        </p>
      </DocSection>

      <DocSection id="projeto">
        <h2 className="display text-2xl text-ink md:text-3xl">
          {PROJECT_DEV.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ash">
          Transformação da pesquisa em experiência para a ExpoPT — com ênfase
          nas expectativas do <strong className="text-forest">2º ano</strong>{" "}
          (autonomia, complexidade técnica e justificativa das tecnologias).
        </p>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          Sequência do curso técnico
        </h3>
        <ol className="mt-4 space-y-3">
          {PROJECT_DEV.sequence.map((item, i) => (
            <li
              key={item.step}
              className="flex gap-3 text-base leading-relaxed text-ink/90"
            >
              <span className="font-display text-sm font-semibold text-forest-mid">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <strong className="text-forest">{item.step}: </strong>
                {item.detail}
              </span>
            </li>
          ))}
        </ol>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          O que foi avaliado no desenvolvimento
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink/90">
          {PROJECT_DEV.criteriaNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          Expectativas do 2º ano
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink/90">
          {PROJECT_DEV.secondYearExpectations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          {PROJECT_DEV.technicalJustification.title}
        </h3>
        {PROJECT_DEV.technicalJustification.paragraphs.map((p) => (
          <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-ink/90">
            {p}
          </p>
        ))}
        <h4 className="mt-8 text-base font-semibold text-ink">
          Stack e recursos utilizados
        </h4>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-relaxed text-ink/90">
          {PROJECT_DEV.technicalJustification.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          Recursos do produto EcoMind
        </h3>
        <ul className="mt-4 space-y-4">
          {PROJECT_DEV.features.map((feature) => (
            <li key={feature.path} className="text-base leading-relaxed text-ink/90">
              <span className="font-semibold text-forest">{feature.name}</span>
              <span className="text-ash"> ({feature.path})</span>
              <p className="mt-1 text-ash">{feature.description}</p>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="apresentacao">
        <h2 className="display text-2xl text-ink md:text-3xl">
          {PRESENTATION.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/90">
          {PRESENTATION.intro}
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {PRESENTATION.domains.map((domain) => (
            <div key={domain.title}>
              <h3 className="text-base font-semibold text-forest">
                {domain.title}
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink/90">
                {domain.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-display text-xl font-semibold text-forest">
          Roteiro sugerido de falas
        </h3>
        <ol className="mt-4 space-y-4">
          {PRESENTATION.suggestedScript.map((line) => (
            <li key={line.who} className="text-base leading-relaxed text-ink/90">
              <span className="font-semibold text-forest">{line.who}: </span>
              “{line.say}”
            </li>
          ))}
        </ol>
      </DocSection>

      <DocSection id="desafio" className="!border-b-0">
        <h2 className="display text-2xl text-ink md:text-3xl">
          {VISITOR_CHALLENGE.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/90">
          {VISITOR_CHALLENGE.goal}
        </p>
        <ul className="mt-6 space-y-3">
          {VISITOR_CHALLENGE.questions.map((q) => (
            <li
              key={q}
              className="border-l-4 border-sprout-deep pl-4 font-display text-lg text-forest"
            >
              {q}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-base leading-relaxed text-ash">
          {VISITOR_CHALLENGE.ourObjective}
        </p>
        <p className="mt-6 text-sm text-ash">
          Tema geral: Voluntariado para o Meio Ambiente — {DOC_META.ods}.
        </p>
      </DocSection>

      <div className="doc-print-footer mt-8 border-t border-[var(--line)] pt-6 text-xs text-ash">
        <p>
          {DOC_META.school} · ExpoPT {DOC_META.year} · {DOC_META.projectName} ·{" "}
          {DOC_META.grade}
        </p>
        <p className="mt-1">
          Documento gerado para leitura digital e impressão / PDF. Pesquisa a
          ser entregue também impressa e encadernada, e via digital pelo Google
          Classroom até {DOC_META.deliveryDate}.
        </p>
      </div>
    </article>
  );
}
