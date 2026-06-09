import 'dotenv/config'
import serverless from 'serverless-http'
import app from '../../src/app'
import db from '../../src/db/connection'
import fs from 'fs'
import path from 'path'

// Garante que o diretório /tmp existe
const dbDir = '/tmp'
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

// Roda migrações + seed na primeira chamada (warm start)
let initialized = false

async function ensureDb() {
  if (initialized) return
  initialized = true

  try {
    // Migrations
    await db.schema.createTableIfNotExists('emissor', (t) => {
      t.increments('id_emissor')
      t.string('cnpj').unique().notNullable()
      t.string('razao_social').notNullable()
      t.string('nome_fantasia')
      t.string('tipo_emissor').notNullable()
      t.text('endereco').notNullable()
      t.string('telefone').notNullable()
      t.string('email').notNullable()
      t.string('status').defaultTo('ativo')
      t.datetime('data_cadastro').defaultTo(db.fn.now())
    })

    await db.schema.createTableIfNotExists('programa', (t) => {
      t.increments('id_programa')
      t.integer('id_emissor').notNullable().references('id_emissor').inTable('emissor').onDelete('RESTRICT')
      t.string('nome').notNullable()
      t.string('codigo_programa').unique().notNullable()
      t.text('descricao').notNullable()
      t.date('data_inicio').notNullable()
      t.date('data_fim')
      t.float('valor_base_mensal').defaultTo(0)
      t.string('periodicidade').defaultTo('mensal')
      t.integer('dia_credito').notNullable()
      t.integer('validade_cartao_meses').defaultTo(24)
      t.boolean('permite_saldo_negativo').defaultTo(false)
      t.float('limite_negativo').defaultTo(0)
      t.boolean('permite_estorno').defaultTo(false)
      t.string('status').defaultTo('ativo')
      t.datetime('created_at').defaultTo(db.fn.now())
      t.datetime('updated_at')
    })

    await db.schema.createTableIfNotExists('beneficiario', (t) => {
      t.increments('id_beneficiario')
      t.string('cpf').unique().notNullable()
      t.string('nome_completo').notNullable()
      t.date('data_nascimento').notNullable()
      t.string('sexo', 1)
      t.string('rg')
      t.string('nome_mae').notNullable()
      t.text('endereco').notNullable()
      t.string('cep').notNullable()
      t.string('telefone').notNullable()
      t.string('email')
      t.string('status_beneficiario').defaultTo('ativo')
      t.datetime('data_cadastro').defaultTo(db.fn.now())
    })

    await db.schema.createTableIfNotExists('comercio', (t) => {
      t.increments('id_comercio')
      t.string('cnpj').unique().notNullable()
      t.string('razao_social').notNullable()
      t.string('nome_fantasia').notNullable()
      t.string('cnae_principal').notNullable()
      t.string('categoria_comercio').notNullable()
      t.text('endereco').notNullable()
      t.string('cep').notNullable()
      t.string('telefone').notNullable()
      t.string('email').notNullable()
      t.string('responsavel_nome').notNullable()
      t.string('responsavel_cpf').notNullable()
      t.string('status_comercio').defaultTo('ativo')
      t.datetime('data_cadastro').defaultTo(db.fn.now())
    })

    await db.schema.createTableIfNotExists('cartao', (t) => {
      t.increments('id_cartao')
      t.string('numero_cartao').unique().notNullable()
      t.integer('id_emissor').notNullable().references('id_emissor').inTable('emissor').onDelete('RESTRICT')
      t.integer('id_programa').notNullable().references('id_programa').inTable('programa').onDelete('RESTRICT')
      t.integer('id_beneficiario').notNullable().references('id_beneficiario').inTable('beneficiario').onDelete('RESTRICT')
      t.string('tipo_cartao').defaultTo('virtual')
      t.date('validade').notNullable()
      t.string('cvv').notNullable()
      t.float('saldo_atual').defaultTo(0)
      t.string('status_cartao').defaultTo('ativo')
      t.datetime('created_at').defaultTo(db.fn.now())
    })

    await db.schema.createTableIfNotExists('credenciamento', (t) => {
      t.increments('id_credenciamento')
      t.integer('id_programa').notNullable().references('id_programa').inTable('programa').onDelete('RESTRICT')
      t.integer('id_comercio').notNullable().references('id_comercio').inTable('comercio').onDelete('RESTRICT')
      t.integer('id_emissor').references('id_emissor').inTable('emissor').onDelete('RESTRICT')
      t.datetime('data_credenciamento').notNullable()
      t.string('status_credenciamento').defaultTo('ativo')
      t.datetime('created_at').defaultTo(db.fn.now())
    })

    await db.schema.createTableIfNotExists('transacao', (t) => {
      t.increments('id_transacao')
      t.integer('id_cartao').notNullable().references('id_cartao').inTable('cartao').onDelete('RESTRICT')
      t.integer('id_comercio').notNullable().references('id_comercio').inTable('comercio').onDelete('RESTRICT')
      t.float('valor_bruto').notNullable()
      t.float('valor_liquido').notNullable()
      t.datetime('data_hora_autorizacao').defaultTo(db.fn.now())
      t.string('nsu').unique().notNullable()
      t.string('tipo_transacao').defaultTo('compra')
      t.string('status_transacao').defaultTo('aprovada')
      t.float('saldo_antes').notNullable()
      t.float('saldo_depois').notNullable()
    })

    await db.schema.createTableIfNotExists('recarga', (t) => {
      t.increments('id_recarga')
      t.integer('id_cartao').notNullable().references('id_cartao').inTable('cartao').onDelete('RESTRICT')
      t.integer('id_programa').notNullable().references('id_programa').inTable('programa').onDelete('RESTRICT')
      t.float('valor_creditado').notNullable()
      t.datetime('data_credito').defaultTo(db.fn.now())
      t.date('periodo_referencia').notNullable()
      t.string('tipo_credito').defaultTo('programado')
    })

    await db.schema.createTableIfNotExists('saque_comercio', (t) => {
      t.increments('id_saque')
      t.integer('id_comercio').notNullable().references('id_comercio').inTable('comercio').onDelete('RESTRICT')
      t.integer('id_programa').notNullable().references('id_programa').inTable('programa').onDelete('RESTRICT')
      t.float('valor_solicitado').notNullable()
      t.float('valor_pago')
      t.string('status_saque').defaultTo('pendente')
      t.datetime('data_solicitacao').defaultTo(db.fn.now())
    })

    // Seed com dados iniciais
    const emissores = await db('emissor').count('id_emissor as c').first()
    if (Number((emissores as any)?.c) === 0) {
      const [id_emissor] = await db('emissor').insert({
        cnpj: '00.000.000/0001-00',
        razao_social: 'Prefeitura Municipal Demo',
        nome_fantasia: 'Valora Gov',
        tipo_emissor: 'prefeitura',
        endereco: 'Rua da Prefeitura, 1 - Centro',
        telefone: '(11) 99999-0000',
        email: 'contato@valora.gov.br',
        status: 'ativo',
      })

      const [id_programa] = await db('programa').insert({
        id_emissor,
        nome: 'Auxílio Alimentação',
        codigo_programa: 'ALIM-001',
        descricao: 'Programa de auxílio alimentação para famílias em vulnerabilidade',
        data_inicio: '2024-01-01',
        valor_base_mensal: 250,
        periodicidade: 'mensal',
        dia_credito: 5,
        validade_cartao_meses: 24,
        status: 'ativo',
      })

      const [id_beneficiario] = await db('beneficiario').insert({
        cpf: '123.456.789-00',
        nome_completo: 'Olivia Rhye',
        data_nascimento: '1985-06-15',
        nome_mae: 'Maria das Graças',
        endereco: 'Rua das Flores, 45 - Centro',
        cep: '01310-100',
        telefone: '(11) 99999-1111',
        email: 'olivia@email.com',
        status_beneficiario: 'ativo',
      })

      const [id_comercio] = await db('comercio').insert({
        cnpj: '11.222.333/0001-44',
        razao_social: 'Supermercado do Silva Ltda',
        nome_fantasia: 'Supermercado do Silva',
        cnae_principal: '4711-3/02',
        categoria_comercio: 'supermercado',
        endereco: 'Rua das Flores, 123 - Centro',
        cep: '01310-100',
        telefone: '(11) 3333-4444',
        email: 'contato@silva.com.br',
        responsavel_nome: 'João Silva',
        responsavel_cpf: '987.654.321-00',
        status_comercio: 'ativo',
      })

      await db('cartao').insert({
        numero_cartao: '0000-0000-0000-0241',
        id_emissor,
        id_programa,
        id_beneficiario,
        tipo_cartao: 'virtual',
        validade: '2026-12-31',
        cvv: '123',
        saldo_atual: 250,
        status_cartao: 'ativo',
      })

      await db('credenciamento').insert({
        id_programa,
        id_comercio,
        id_emissor,
        data_credenciamento: new Date().toISOString(),
        status_credenciamento: 'ativo',
      })
    }

    console.log('[api] DB initialized')
  } catch (err) {
    console.error('[api] DB init error:', err)
  }
}

const handler = serverless(app)

export { handler }

module.exports.handler = async (event: any, context: any) => {
  await ensureDb()
  return handler(event, context)
}
