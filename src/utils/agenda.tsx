import { EstadoEnum, AgendamentoTipoEnum } from "../api/models"
import type { Agendamento } from "../api/models"
import { Badge } from "@mantine/core"


export function paraMaiuscula(s: string) {
  return s[0].toUpperCase() + s.substring(1)
}

export function getEstadoBadge(estado?: Agendamento['estado']) {
  switch (estado) {
    case EstadoEnum.agendado:
      return <Badge color="teal">Agendado</Badge>
    case EstadoEnum.realizado:
      return <Badge color="green">Realizado</Badge>
    case EstadoEnum.cancelado:
      return <Badge color="red">Cancelado</Badge>
    default:
      return <Badge color="gray">Desconhecido</Badge>
  }
}

export function getTipoBadge(tipo: Agendamento['tipo']) {
  const label =
    tipo === AgendamentoTipoEnum.presencial ? 'Presencial' : 'Online'
  const color = tipo === AgendamentoTipoEnum.presencial ? 'green' : 'blue'
  return <Badge color={color}>{label}</Badge>
}

export function formatarHora(horaString: string): string {
  const data = new Date(`2000-01-01T${horaString}Z`)
  const horaFormatada = new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
  return horaFormatada
}

export function formatarData(dataString: string): string {
  const dataFormatada = new Date(`${dataString}T00:00:00Z`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  })
  return dataFormatada
}

export function formatarDataHora(dataString: string, horaString: string): string {
  const dataFormatada = formatarData(dataString)
  const horaFormatada = formatarHora(horaString)
  return `${dataFormatada} às ${horaFormatada}`
}

