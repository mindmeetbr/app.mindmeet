import { useState } from 'react'

interface PaginacaoOptions {
  tamanhoInicial?: number
}

export interface PaginacaoState {
  pagina: number
  tamanho: number
  setPagina: (pagina: number) => void
  setTamanho: (tamanho: number) => void
  totalPaginas: (total: number) => number
}

// hook genérico de paginação. encapsula o estado de pagina e tamanho
export function usePaginacao({
  tamanhoInicial = 10,
}: PaginacaoOptions = {}): PaginacaoState {
  const [pagina, setPaginaInterna] = useState(1)
  const [tamanho, setTamanhoInterno] = useState(tamanhoInicial)

  const setTamanho = (novoTamanho: number) => {
    setTamanhoInterno(novoTamanho)
    setPaginaInterna(1)
  }

  const totalPaginas = (total: number) => Math.ceil(total / tamanho)

  return {
    pagina,
    tamanho,
    setPagina: setPaginaInterna,
    setTamanho,
    totalPaginas,
  }
}
