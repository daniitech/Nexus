
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'monitor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ SETORES ============
CREATE TABLE public.setores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.setores TO authenticated;
GRANT ALL ON public.setores TO service_role;
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read setores" ON public.setores FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write setores" ON public.setores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update setores" ON public.setores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete setores" ON public.setores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_setores_updated BEFORE UPDATE ON public.setores FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ CARTEIRAS ============
CREATE TABLE public.carteiras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  setor_id uuid REFERENCES public.setores(id) ON DELETE SET NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carteiras TO authenticated;
GRANT ALL ON public.carteiras TO service_role;
ALTER TABLE public.carteiras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read carteiras" ON public.carteiras FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write carteiras" ON public.carteiras FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update carteiras" ON public.carteiras FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete carteiras" ON public.carteiras FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_carteiras_updated BEFORE UPDATE ON public.carteiras FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ REQUISITOS ============
CREATE TABLE public.requisitos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  titulo text NOT NULL,
  descricao text,
  peso numeric(5,2) NOT NULL DEFAULT 1,
  critico boolean NOT NULL DEFAULT false,
  carteira_id uuid REFERENCES public.carteiras(id) ON DELETE CASCADE,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.requisitos TO authenticated;
GRANT ALL ON public.requisitos TO service_role;
ALTER TABLE public.requisitos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read requisitos" ON public.requisitos FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write requisitos" ON public.requisitos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update requisitos" ON public.requisitos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete requisitos" ON public.requisitos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_requisitos_updated BEFORE UPDATE ON public.requisitos FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ OPERADORES ============
CREATE TABLE public.operadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula text NOT NULL UNIQUE,
  nome text NOT NULL,
  email text,
  carteira_id uuid REFERENCES public.carteiras(id) ON DELETE SET NULL,
  setor_id uuid REFERENCES public.setores(id) ON DELETE SET NULL,
  cargo text,
  data_admissao date,
  notas text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.operadores TO authenticated;
GRANT ALL ON public.operadores TO service_role;
ALTER TABLE public.operadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read operadores" ON public.operadores FOR SELECT TO authenticated USING (true);
-- Monitores e admins podem editar operadores (notas + informações)
CREATE POLICY "monitor write operadores" ON public.operadores FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'monitor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "monitor update operadores" ON public.operadores FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'monitor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'monitor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete operadores" ON public.operadores FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_operadores_updated BEFORE UPDATE ON public.operadores FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MONITORIAS ============
CREATE TABLE public.monitorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE,
  operador_id uuid NOT NULL REFERENCES public.operadores(id) ON DELETE CASCADE,
  carteira_id uuid REFERENCES public.carteiras(id) ON DELETE SET NULL,
  monitor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  data_avaliacao timestamptz NOT NULL DEFAULT now(),
  score numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'rascunho',
  critico boolean NOT NULL DEFAULT false,
  observacoes text,
  audio_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monitorias TO authenticated;
GRANT ALL ON public.monitorias TO service_role;
ALTER TABLE public.monitorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read monitorias" ON public.monitorias FOR SELECT TO authenticated USING (true);
CREATE POLICY "monitor insert monitorias" ON public.monitorias FOR INSERT TO authenticated
  WITH CHECK ((public.has_role(auth.uid(), 'monitor') OR public.has_role(auth.uid(), 'admin')) AND monitor_id = auth.uid());
CREATE POLICY "monitor update monitorias" ON public.monitorias FOR UPDATE TO authenticated
  USING (monitor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (monitor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete monitorias" ON public.monitorias FOR DELETE TO authenticated
  USING (monitor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_monitorias_updated BEFORE UPDATE ON public.monitorias FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MONITORIA_ITENS ============
CREATE TABLE public.monitoria_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitoria_id uuid NOT NULL REFERENCES public.monitorias(id) ON DELETE CASCADE,
  requisito_id uuid NOT NULL REFERENCES public.requisitos(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'na',
  nota numeric(5,2),
  comentario text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (monitoria_id, requisito_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monitoria_itens TO authenticated;
GRANT ALL ON public.monitoria_itens TO service_role;
ALTER TABLE public.monitoria_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read itens" ON public.monitoria_itens FOR SELECT TO authenticated USING (true);
CREATE POLICY "monitor write itens" ON public.monitoria_itens FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.monitorias m WHERE m.id = monitoria_id
            AND (m.monitor_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.monitorias m WHERE m.id = monitoria_id
            AND (m.monitor_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
  );
CREATE TRIGGER trg_itens_updated BEFORE UPDATE ON public.monitoria_itens FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ ÍNDICES ============
CREATE INDEX idx_operadores_carteira ON public.operadores(carteira_id);
CREATE INDEX idx_monitorias_operador ON public.monitorias(operador_id);
CREATE INDEX idx_monitorias_monitor ON public.monitorias(monitor_id);
CREATE INDEX idx_monitorias_data ON public.monitorias(data_avaliacao DESC);
CREATE INDEX idx_itens_monitoria ON public.monitoria_itens(monitoria_id);
