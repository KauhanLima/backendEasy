from flask import Flask, request, jsonify
import requests
from datetime import datetime, timedelta

app = Flask(__name__)

OMIE_APP_KEY = '6887695778964'
OMIE_APP_SECRET = '9aa89482d2cc134634cbbd4f45c2cf3a'


def consultar_movimentos():
    body = {
        "call": "ListarMovimentos",
        "app_key": OMIE_APP_KEY,
        "app_secret": OMIE_APP_SECRET,
        "param": [{
            "nPagina": 1,
            "nRegPorPagina": 500
        }]
    }

    try:
        response = requests.post(
            'https://app.omie.com.br/api/v1/financas/mf/', json=body)
        data = response.json()

        # 🔍 DEBUG: imprimir retorno CRU da Omie
        print("\n\n🔍 RETORNO CRU DA OMIE:")
        try:
            import json
            print(json.dumps(data, indent=4, ensure_ascii=False))
        except:
            print(data)
        print("--------------------------------------------------\n\n")

        movimentos = data.get("movimentos", [])

        # PADRONIZAR CAMPOS PARA O CHATBOT
        movimentos_formatados = []
        for m in movimentos:
            detalhes = m.get("detalhes", {})

            # padroniza datas
            dt = detalhes.get("dDtPagamento") or detalhes.get("dDtPrevisao")
            if dt:
                dia, mes, ano = map(int, dt.split("/"))
                dt_formatada = f"{ano}-{mes:02d}-{dia:02d}"
            else:
                dt_formatada = None

            movimentos_formatados.append({
                "detalhes": {
                    "nValorTitulo": detalhes.get("nValorTitulo", 0),
                    "cCodCateg": detalhes.get("cCodCateg", "").strip(),
                    "cNatureza": detalhes.get("cNatureza", ""),  # R ou P
                    "dDataMovimento": dt_formatada
                }
            })

        return movimentos_formatados

    except Exception as e:
        print("Erro na API Omie:", e)
        return []


@app.route("/omie/filtrar", methods=["POST"])
def filtrar_movimentos():
    filtros = request.json

    categoria = filtros.get("categoria")
    data_inicio = filtros.get("data_inicio")
    data_fim = filtros.get("data_fim")

    data_inicio = datetime.strptime(data_inicio, "%Y-%m-%d")
    data_fim = datetime.strptime(data_fim, "%Y-%m-%d")

    movimentos = consultar_movimentos()
    filtrados = []

    for mov in movimentos:
        det = mov["detalhes"]
        valor = float(det["nValorTitulo"])
        categoria_mov = det["cCodCateg"]
        natureza = det["cNatureza"]
        data_mov = datetime.strptime(det["dDataMovimento"], "%Y-%m-%d")

        if not (data_inicio <= data_mov <= data_fim):
            continue

        if categoria and not categoria_mov.startswith(categoria):
            continue

        filtrados.append(mov)

    return jsonify({
        "movimentos": filtrados,
        "total_movimentos": len(filtrados)
    })


if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")

