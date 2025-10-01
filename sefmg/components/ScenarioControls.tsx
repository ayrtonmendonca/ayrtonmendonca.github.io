import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Cenario, parametrosDeCenario, parametrosGlobais } from "../types";
import {
  PALETA_DE_CORES,
  POSICAO_CARREIRA,
  VENCIMENTO_BASICO,
  PONTOS_GEPI,
  VALOR_PONTO_GEPI,
  VALOR_DIARIO_VI,
  PERCENTUAL_PREVCOM_PADRAO,
  NIVEL_PADRAO,
  TETO_GEPI,
  TETO_SERVIDOR_PUBLICO,
  ANO_INGRESSO_PADRAO,
} from "../constants";

import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Dialog from "./ui/Dialog";

interface propriedadesControleCenario {
  cenarios: Cenario[];
  adicionarCenario: (cenario: Cenario) => void;
  atualizarCenario: (cenario: Cenario) => void;
  removeCenario: (id: string) => void;
  anosProjecao: number;
  defineAnosProjecao: (years: number) => void;
}

const formatarNomePosicao = (position: string) => {
  const [nivel, grau] = position.split("-");
  return `Nível ${nivel} - Grau ${grau}`;
};

const ControleCenario: React.FC<propriedadesControleCenario> = ({
  cenarios,
  adicionarCenario,
  atualizarCenario,
  removeCenario,
  anosProjecao,
  defineAnosProjecao,
}) => {
  const [estaEditando, defineEstaEditando] = useState<string | null>(null);
  const [abrirModal, setAbrirModal] = useState(false);

  const [parametrosCenarioAtuais, defineParametrosCenarioAtuais] =
    useState<parametrosDeCenario>({
      posicaoCarreira: NIVEL_PADRAO,
      anoIngresso: ANO_INGRESSO_PADRAO,
      dependentes: 0,
      diasTrabalhados: 20,
      RGAMedio: 0,
      crescimentoGEPIMedio: 0,
      tetoGEPI: TETO_GEPI,
      tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
      valorVIDiaria: VALOR_DIARIO_VI,
      salarioBaseSobreposto: VENCIMENTO_BASICO.calcularVB(NIVEL_PADRAO),
      pontosGEPI: PONTOS_GEPI,
      valorPontoGEPI: VALOR_PONTO_GEPI,
      filiadoAoSindicato: true,
      prevcom: true,
      percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    });

  const [nomeCenario, defineNomeCenario] = useState("Novo Cenário");

  const calculaProximaCor = useCallback(() => {
    return PALETA_DE_CORES[cenarios.length % PALETA_DE_CORES.length];
  }, [cenarios.length]);

  useEffect(() => {
    if (!estaEditando) {
      defineNomeCenario(`Cenário ${cenarios.length + 1}`);
    }
  }, [cenarios.length, estaEditando]);

  const gerenciarSalvamento = () => {
    if (estaEditando) {
      const cenarioParaAtualizar = cenarios.find((s) => s.id === estaEditando);
      if (cenarioParaAtualizar) {
        atualizarCenario({
          ...cenarioParaAtualizar,
          nome: nomeCenario,
          parametros: parametrosCenarioAtuais,
        });
      }
    } else {
      adicionarCenario({
        id: uuidv4(),
        nome: nomeCenario,
        cor: calculaProximaCor(),
        parametros: parametrosCenarioAtuais,
      });
    }
    reiniciarFormulario();
    setAbrirModal(false);
  };

  const reiniciarFormulario = () => {
    defineEstaEditando(null);
    defineNomeCenario("");
    defineParametrosCenarioAtuais({
      posicaoCarreira: NIVEL_PADRAO,
      anoIngresso: ANO_INGRESSO_PADRAO,
      dependentes: 0,
      diasTrabalhados: 20,
      RGAMedio: 0,
      crescimentoGEPIMedio: 0,
      tetoGEPI: TETO_GEPI,
      tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
      valorVIDiaria: VALOR_DIARIO_VI,
      salarioBaseSobreposto: VENCIMENTO_BASICO.calcularVB(NIVEL_PADRAO),
      pontosGEPI: PONTOS_GEPI,
      valorPontoGEPI: VALOR_PONTO_GEPI,
      filiadoAoSindicato: true,
      prevcom: true,
      percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    });
  };

  const gerenciarEdicao = (cenario: Cenario) => {
    defineEstaEditando(cenario.id);
    defineNomeCenario(cenario.nome);
    defineParametrosCenarioAtuais(cenario.parametros);
    setAbrirModal(true);
  };

  const gerenciarCancelamentoEdicao = () => {
    reiniciarFormulario();
    setAbrirModal(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header com botão de adicionar */}
      <Card className="col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Cenários Ativos
          </h3>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setAbrirModal(true)}>
              Adicionar Cenário
            </Button>
          </div>
        </div>

        {/* Lista de cenários */}
        <ul className="space-y-3">
          {cenarios.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <span
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: s.cor }}
                ></span>
                <span className="font-semibold">{s.nome}</span>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => gerenciarEdicao(s)}
                  className="px-2 py-1 text-xs"
                >
                  Editar
                </Button>
                {cenarios.length > 1 && (
                  <Button
                    variant="danger"
                    onClick={() => removeCenario(s.id)}
                    className="px-2 py-1 text-xs"
                  >
                    Remover
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Modal para adicionar/editar */}
      <Dialog open={abrirModal} onClose={gerenciarCancelamentoEdicao}>
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {estaEditando ? "Editar Cenário" : "Adicionar Cenário"}
        </h3>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input
            label="Nome do Cenário"
            id="nomeCenario"
            value={nomeCenario}
            onChange={(e) => defineNomeCenario(e.target.value)}
          />

          <Input
            label="Vencimento Básico (R$)"
            id="salarioBaseSobreposto"
            type="number"
            step="0.01"
            value={parametrosCenarioAtuais.salarioBaseSobreposto}
            onChange={(e) =>
              defineParametrosCenarioAtuais((p) => ({
                ...p,
                salarioBaseSobreposto: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <Input
            label="Pontos GEPI"
            id="pontosGEPI"
            type="number"
            value={parametrosCenarioAtuais.pontosGEPI}
            onChange={(e) =>
              defineParametrosCenarioAtuais((p) => ({
                ...p,
                pontosGEPI: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <Input
            label="Valor do Ponto GEPI (R$)"
            id="valorPontoGEPI"
            type="number"
            step="0.01"
            value={parametrosCenarioAtuais.valorPontoGEPI}
            onChange={(e) =>
              defineParametrosCenarioAtuais((p) => ({
                ...p,
                valorPontoGEPI: parseFloat(e.target.value) || 0,
              }))
            }
          />

          <Input
            label="Valor Diário VI (R$)"
            id="valorVIDiaria"
            type="number"
            step="0.01"
            value={parametrosCenarioAtuais.valorVIDiaria}
            onChange={(e) =>
              defineParametrosCenarioAtuais((p) => ({
                ...p,
                valorVIDiaria: parseFloat(e.target.value) || 0,
              }))
            }
          />

        </div>

        <div className="flex space-x-2 mt-6">
          <Button onClick={gerenciarSalvamento}>
            {estaEditando ? "Salvar Alterações" : "Adicionar Cenário"}
          </Button>
          <Button variant="secondary" onClick={gerenciarCancelamentoEdicao}>
            Cancelar
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ControleCenario;