import type { DisponibilidadeDiaEnum } from '../../../api/models'

export interface HorarioLocal {
  id: string
  inicio: string
  fim: string
  ocupado?: boolean | null
}

export interface DisponibilidadeLocal {
  id: string
  dia: DisponibilidadeDiaEnum
  dia_semana: string
  ativo: boolean
  horarios: HorarioLocal[]
}
