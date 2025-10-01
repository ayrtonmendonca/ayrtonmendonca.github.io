import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Cenario, parametrosDeCenario } from "../types";
import {
    PALETA_DE_CORES,
    VENCIMENTO_BASICO,
    VALOR_DIARIO_VI,
    PONTOS_GEPI,
} from "../constants";

import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Dialog from "./ui/Dialog";

interface propriedadesControleCenario {
    cenarios: Cenario[];
    adicionarCenario: (cenario: Cenario) => void;
    atualizarCenario: (cenario: Cenario) => void;
    removeCenario: (id: string) => void;
}

const ControleCenario: React.FC<propriedadesControleCenario> = ({
    cenarios,
    adicionarCenario,
    atualizarCenario,
    removeCenario
}) => {
    const [estaEditando, defineEstaEditando] = useState<string | null>(null);
    const [abrirModal, setAbrirModal] = useState(false);

    const [parametrosCenarioAtuais, defineParametrosCenarioAtuais] =
        useState<parametrosDeCenario>({
            valorVIDiaria: VALOR_DIARIO_VI,
            salarioBaseInicial: VENCIMENTO_BASICO.calcularVB('I-A'),
            pontosGEPI: PONTOS_GEPI
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
        // Validação de campos obrigatórios
        const { salarioBaseInicial, pontosGEPI, valorVIDiaria } = parametrosCenarioAtuais;
        if (
            salarioBaseInicial === undefined || salarioBaseInicial <= 0 ||
            pontosGEPI === undefined || pontosGEPI < 0 ||
            valorVIDiaria === undefined || valorVIDiaria <= 0
        ) {
            alert("Preencha todos os campos obrigatórios corretamente!");
            return;
        }

        if (estaEditando) {
            const cenarioParaAtualizar = cenarios.find((s) => s.id === estaEditando);
            if (cenarioParaAtualizar) {
                atualizarCenario({
                    ...cenarioParaAtualizar,
                    nome: nomeCenario || `Cenário ${cenarios.length + 1}`,
                    parametros: parametrosCenarioAtuais,
                });
            }
        } else {
            adicionarCenario({
                id: uuidv4(),
                nome: nomeCenario || `Cenário ${cenarios.length + 1}`,
                cor: calculaProximaCor(),
                parametros: parametrosCenarioAtuais,
            });
        }
        reiniciarFormulario();
        setAbrirModal(false);
    };

    const reiniciarFormulario = () => {
        defineEstaEditando(null);
        defineNomeCenario(`Cenário ${cenarios.length + 1}`);
        defineParametrosCenarioAtuais({
            valorVIDiaria: VALOR_DIARIO_VI,
            salarioBaseInicial: VENCIMENTO_BASICO.calcularVB('I-A'),
            pontosGEPI: PONTOS_GEPI,
            repique: true
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
                        <Button onClick={() => {
                            reiniciarFormulario();
                            setAbrirModal(true);
                        }}>
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
                            <div className="flex flex-col items-start">
                                <div className="flex items-center">
                                    <span
                                        className="w-4 h-4 rounded-full mr-3"
                                        style={{ backgroundColor: s.cor }}
                                    ></span>
                                    <span className="font-semibold">{s.nome}</span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 ml-7">
                                    VB Inicial: R$ {s.parametros.salarioBaseInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | GEPI: {s.parametros.pontosGEPI.toLocaleString('pt-BR')} pts | VI: R$ {s.parametros.valorVIDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Repique: {s.parametros.repique ? 'Sim' : 'Não'}
                                </span>
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
                        label="Vencimento Básico Inicial"
                        id="salarioBaseInicial"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        value={parametrosCenarioAtuais.salarioBaseInicial}
                        onChange={(e) =>
                            defineParametrosCenarioAtuais((p) => ({
                                ...p,
                                salarioBaseInicial: parseFloat(e.target.value) || 0,
                            }))
                        }
                    />

                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="checkbox"
                            id="repique"
                            checked={parametrosCenarioAtuais.repique || false}
                            onChange={(e) =>
                                defineParametrosCenarioAtuais((p) => ({
                                    ...p,
                                    repique: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="repique" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Repique
                        </label>
                    </div>

                    <Input
                        label="Pontos GEPI"
                        id="pontosGEPI"
                        type="number"
                        min={0}
                        value={parametrosCenarioAtuais.pontosGEPI}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            defineParametrosCenarioAtuais((p) => ({
                                ...p,
                                pontosGEPI: isNaN(value) ? 0 : Math.max(0, value),
                            }));
                        }}
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