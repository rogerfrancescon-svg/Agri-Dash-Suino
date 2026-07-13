#!/bin/bash

# Update App.tsx alerts
sed -i 's/alert(`Erro ao salvar lançamento:\\n\\n${error.message}.*/alert(`Erro ao salvar lançamento:\\n\\n${error.message}\\n\\nPara corrigir este erro (incluindo erro de cache), vá ao painel do Supabase, acesse o SQL Editor e execute tudo isto:\\n\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Tipo Lote" text DEFAULT '"'"'Misto'"'"';\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Peso aloj" numeric;\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Pontuação Sanitária" numeric;\\nNOTIFY pgrst, '"'"'reload schema'"'"';`);/' src/App.tsx

sed -i 's/alert(`Erro ao atualizar lançamento:\\n\\n${error.message}.*/alert(`Erro ao atualizar lançamento:\\n\\n${error.message}\\n\\nPara corrigir este erro (incluindo erro de cache), vá ao painel do Supabase, acesse o SQL Editor e execute tudo isto:\\n\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Tipo Lote" text DEFAULT '"'"'Misto'"'"';\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Peso aloj" numeric;\\nALTER TABLE registros ADD COLUMN IF NOT EXISTS "Pontuação Sanitária" numeric;\\nNOTIFY pgrst, '"'"'reload schema'"'"';`);/' src/App.tsx

sed -i 's/alert(`Erro ao deletar lançamento:\\n\\n${error.message}.*/alert(`Erro ao deletar lançamento:\\n\\n${error.message}\\n\\nSe for um erro de RLS, acesse o SQL Editor do Supabase e execute:\\nALTER TABLE registros DISABLE ROW LEVEL SECURITY;`);/' src/App.tsx

sed -i 's/alert(`Erro ao deletar integrado:\\n\\n${error.message}.*/alert(`Erro ao deletar integrado:\\n\\n${error.message}\\n\\nSe for um erro de RLS, acesse o SQL Editor do Supabase e execute:\\nALTER TABLE registros DISABLE ROW LEVEL SECURITY;`);/' src/App.tsx

# Update ImportData.tsx alerts
sed -i 's/alert(`Erro ao apagar os dados:\\n\\n${e.message}.*/alert(`Erro ao apagar os dados:\\n\\n${e.message}\\n\\nSe for um erro de RLS, acesse o SQL Editor do Supabase e execute:\\nALTER TABLE registros DISABLE ROW LEVEL SECURITY;`);/' src/components/ImportData.tsx

