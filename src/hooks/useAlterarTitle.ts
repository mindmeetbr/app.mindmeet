import { useEffect } from 'react'

const NOME_APP = 'MindMeet'

/**
 * Hook responsável por alterar dinamicamente o título da página (document.title)
 * em aplicações React.
 *
 * O título será composto pelo nome da página seguido do nome da aplicação,
 * separados por travessão (—). Caso nenhum nome de página seja informado,
 * apenas o nome da aplicação será exibido.
 *
 * Exemplo de uso:
 * ```ts
 * useAlterarTitle("Dashboard");
 * // Resultado: "Dashboard — MindMeet"
 * ```
 *
 * ```ts
 * useAlterarTitle();
 * // Resultado: "MindMeet"
 * ```
 *
 * @param nomePagina Nome da página atual que será exibido antes do nome da aplicação.
 * Deve ser uma string opcional. Quando não fornecida, o título exibirá apenas o nome do app.
 *
 * @returns Este hook não retorna nenhum valor.
 */
export function useAlterarTitle(nomePagina?: string) {
  useEffect(() => {
    const tituloOriginal = document.title
    document.title = nomePagina ? `${nomePagina} — ${NOME_APP}` : NOME_APP
    return () => {
      document.title = tituloOriginal
    }
  }, [nomePagina])
}
