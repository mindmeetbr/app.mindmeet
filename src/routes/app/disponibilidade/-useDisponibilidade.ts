import { useMemo } from 'react'
import {
  type useDisponibilidadeCreate,
  useDisponibilidadeList,
  type useDisponibilidadeUpdate,
} from '../../../api/endpoints/disponibilidades/disponibilidades'
import type {
  DisponibilidadeDiaEnum,
  Disponibilidade,
} from '../../../api/models'
import type { DisponibilidadeLocal, HorarioLocal } from './-types'

export const diasSemana = [
  { value: '0', label: 'Segunda-feira' },
  { value: '1', label: 'Terça-feira' },
  { value: '2', label: 'Quarta-feira' },
  { value: '3', label: 'Quinta-feira' },
  { value: '4', label: 'Sexta-feira' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
]

function normalizarDisponibilidade(d: Disponibilidade): DisponibilidadeLocal {
  return {
    id: d.id,
    dia: d.dia,
    dia_semana: d.dia_semana,
    ativo: d.ativo ?? false,
    horarios: (d.horarios ?? []).map(
      (h): HorarioLocal => ({
        id: h.id ?? crypto.randomUUID(),
        inicio: h.inicio,
        fim: h.fim,
        ocupado: h.ocupado,
      })
    ),
  }
}

export function montarDisponibilidadesIniciais(
  dados: Disponibilidade[]
): DisponibilidadeLocal[] {
  const mapa = new Map(dados.map(d => [d.dia, d]))

  return diasSemana.map((dia, index) => {
    const diaEnum = index as DisponibilidadeDiaEnum
    const existente = mapa.get(diaEnum)

    if (existente) return normalizarDisponibilidade(existente)

    return {
      id: crypto.randomUUID(),
      dia: diaEnum,
      dia_semana: dia.label,
      ativo: false,
      horarios: [],
    }
  })
}

export function useDisponibilidadesMerged() {
  const { data, isSuccess, isLoading } = useDisponibilidadeList()

  const disponibilidades = useMemo(() => {
    if (!isSuccess || !data) return []
    return montarDisponibilidadesIniciais(data)
  }, [data, isSuccess])

  const idsDisponibilidades = useMemo(() => data?.map(d => d.id) ?? [], [data])

  const idsHorarios = useMemo(
    () =>
      data?.flatMap(d => d.horarios?.map(h => h.id).filter(Boolean) ?? []) ??
      [],
    [data]
  )

  return { disponibilidades, idsDisponibilidades, idsHorarios, isLoading }
}

interface SalvarDiaParams {
  dia: DisponibilidadeLocal
  idsDisponibilidades: string[]
  idsHorarios: (string | undefined)[]
  salvarDisponibilidade: ReturnType<typeof useDisponibilidadeCreate>['mutate']
  atualizarDisponibilidade: ReturnType<
    typeof useDisponibilidadeUpdate
  >['mutate']
}

export function salvarDisponibilidadeDia({
  dia,
  idsDisponibilidades,
  idsHorarios,
  salvarDisponibilidade,
  atualizarDisponibilidade,
}: SalvarDiaParams): void {
  const { id, ...dados } = dia

  const horariosSerializados = dados.horarios.map(horario => {
    if (idsHorarios.includes(horario.id)) return horario
    const { id: _id, ...novoHorario } = horario
    return novoHorario
  })

  const payload = { ...dados, horarios: horariosSerializados }

  if (idsDisponibilidades.includes(id)) {
    atualizarDisponibilidade({ id, data: payload })
  } else {
    salvarDisponibilidade({ data: payload })
  }
}
