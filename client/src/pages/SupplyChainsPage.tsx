import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

type SupplyChainStatus = 'active' | 'planning';

interface SupplyChain {
  id: number;
  name: string;
  description: string;
  participants: number;
  materials: string[];
  carbonSaved: string;
  status: SupplyChainStatus;
  location?: string;
  admin?: string;
}

interface SupplyChainForm {
  name: string;
  description: string;
  participants: string;
  materials: string;
  carbonSaved: string;
  status: SupplyChainStatus;
  location: string;
  admin: string;
}

const emptyForm: SupplyChainForm = {
  name: '',
  description: '',
  participants: '1',
  materials: '',
  carbonSaved: '0 tons CO2e',
  status: 'planning',
  location: '',
  admin: ''
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  line-height: 1.6;
`;

const ChainCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 2rem;
`;

const ChainHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.main};
  padding: 1.5rem;
  color: white;
`;

const ChainName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ChainMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const MetaText = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ChainDetails = styled.div`
  padding: 1.5rem;
`;

const ChainDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ChainStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary.dark};
`;

const MaterialsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const MaterialTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary.light}30;
  color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ $status, theme }) =>
    $status === 'active' ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ $status, theme }) =>
    $status === 'active' ? theme.colors.success : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const VisualizationSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const VisualizationTitle = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const SupplyChainDiagram = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  overflow-x: auto;
`;

const DiagramNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
`;

const NodeIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme }) => theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NodeLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const NodeConnection = styled.div`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary.light};
  flex-grow: 1;
  margin: 0 0.5rem;
  position: relative;

  &::after {
    content: '>';
    position: absolute;
    top: -10px;
    right: -5px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.main};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary.light}20;
  }
`;

const InfoBox = styled.div`
  background-color: ${({ theme }) => theme.colors.info}10;
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  padding: 1.5rem;
  margin-top: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.info};
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font: inherit;
  background: ${({ theme }) => theme.colors.background.paper};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font: inherit;
  background: ${({ theme }) => theme.colors.background.paper};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font: inherit;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background.paper};
`;

const Message = styled.div<{ $kind?: 'success' | 'error' }>`
  grid-column: 1 / -1;
  padding: 0.8rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $kind, theme }) =>
    $kind === 'error' ? `${theme.colors.error}15` : `${theme.colors.success}15`};
  color: ${({ $kind, theme }) => ($kind === 'error' ? theme.colors.error : theme.colors.success)};
`;

const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SupplyChainsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [supplyChains, setSupplyChains] = useState<SupplyChain[]>([]);
  const [form, setForm] = useState<SupplyChainForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSupplyChains = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/supply-chains');
        setSupplyChains(response.data.supplyChains || []);
      } catch (error) {
        console.error('Failed to load supply chains:', error);
        setMessage({ kind: 'error', text: 'Could not load supply chains. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplyChains();
  }, []);

  const handleViewDetails = (chainId: number) => {
    navigate(`/supply-chains/${chainId}`);
  };

  const handleJoinChain = (chain: SupplyChain) => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/supply-chains');
      return;
    }

    alert(`You have requested to join the "${chain.name}" supply chain. The administrator will review your request.`);
  };

  const updateForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateSupplyChain = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      navigate('/login?redirect=/supply-chains');
      return;
    }

    if (!isAdmin) {
      setMessage({ kind: 'error', text: 'Only admin users can create supply chains.' });
      return;
    }

    const materials = form.materials
      .split(',')
      .map((material) => material.trim())
      .filter(Boolean);

    if (!form.name.trim() || !form.description.trim() || materials.length === 0) {
      setMessage({ kind: 'error', text: 'Please fill in the name, description, and at least one material.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);

      const response = await api.post('/api/supply-chains', {
        name: form.name.trim(),
        description: form.description.trim(),
        participants: Number(form.participants) || 1,
        materials,
        carbonSaved: form.carbonSaved.trim() || '0 tons CO2e',
        status: form.status,
        location: form.location.trim(),
        admin: form.admin.trim() || user?.name || 'ReCircle Admin'
      });

      setSupplyChains((current) => [response.data.supplyChain, ...current]);
      setForm(emptyForm);
      setMessage({ kind: 'success', text: 'Supply chain created successfully.' });
    } catch (error: any) {
      const text = error?.response?.data?.message || 'Could not create the supply chain. Please try again.';
      setMessage({ kind: 'error', text });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Circular Supply Chains</Title>
          <Subtitle>
            Connect with companies across industries to create closed-loop supply chains,
            track material flows, and measure environmental impact.
          </Subtitle>
        </motion.div>
      </Header>

      {isLoading && <InfoText>Loading supply chains...</InfoText>}

      {supplyChains.map((chain) => (
        <ChainCard
          key={chain.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChainHeader>
            <ChainName>{chain.name}</ChainName>
            <ChainMeta>
              <StatusBadge $status={chain.status}>
                {chain.status === 'active' ? 'Active' : 'Planning Phase'}
              </StatusBadge>
              {chain.location && <MetaText>{chain.location}</MetaText>}
              {chain.admin && <MetaText>Managed by {chain.admin}</MetaText>}
            </ChainMeta>
          </ChainHeader>

          <ChainDetails>
            <ChainDescription>{chain.description}</ChainDescription>

            <ChainStats>
              <StatItem>
                <StatLabel>Participants</StatLabel>
                <StatValue>{chain.participants} companies</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Carbon Saved</StatLabel>
                <StatValue>{chain.carbonSaved}</StatValue>
              </StatItem>
            </ChainStats>

            <StatLabel>Materials</StatLabel>
            <MaterialsList>
              {chain.materials.map((material) => (
                <MaterialTag key={material}>{material}</MaterialTag>
              ))}
            </MaterialsList>

            <VisualizationSection>
              <VisualizationTitle>Supply Chain Flow</VisualizationTitle>

              <SupplyChainDiagram>
                {['Collection', 'Sorting', 'Processing', 'Manufacturing', 'Distribution'].map((step, index) => (
                  <React.Fragment key={step}>
                    <DiagramNode>
                      <NodeIcon>{index + 1}</NodeIcon>
                      <NodeLabel>{step}</NodeLabel>
                    </DiagramNode>
                    {index < 4 && <NodeConnection />}
                  </React.Fragment>
                ))}
              </SupplyChainDiagram>
            </VisualizationSection>

            <ButtonsContainer>
              <Button onClick={() => handleViewDetails(chain.id)}>View Details</Button>
              <OutlineButton onClick={() => handleJoinChain(chain)}>Join Chain</OutlineButton>
            </ButtonsContainer>
          </ChainDetails>
        </ChainCard>
      ))}

      <InfoBox>
        <InfoTitle>Create a New Supply Chain</InfoTitle>
        <InfoText>
          Admins can add new circular supply chains here. New chains are saved in the demo API
          and appear at the top of this page immediately.
        </InfoText>

        {!isLoggedIn && (
          <ButtonsContainer>
            <OutlineButton onClick={() => navigate('/login?redirect=/supply-chains')}>
              Login as Admin
            </OutlineButton>
          </ButtonsContainer>
        )}

        {isLoggedIn && !isAdmin && (
          <Message $kind="error">Only admin users can create supply chains.</Message>
        )}

        {isAdmin && (
          <Form onSubmit={handleCreateSupplyChain}>
            <Field>
              Supply Chain Name
              <Input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Organic Waste Composting Network"
              />
            </Field>

            <Field>
              Status
              <Select name="status" value={form.status} onChange={updateForm}>
                <option value="planning">Planning Phase</option>
                <option value="active">Active</option>
              </Select>
            </Field>

            <Field $wide>
              Description
              <TextArea
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="Describe the closed-loop material flow and partner network."
              />
            </Field>

            <Field>
              Materials
              <Input
                name="materials"
                value={form.materials}
                onChange={updateForm}
                placeholder="Food waste, Compost, Biogas"
              />
            </Field>

            <Field>
              Participants
              <Input
                name="participants"
                type="number"
                min="1"
                value={form.participants}
                onChange={updateForm}
              />
            </Field>

            <Field>
              Carbon Saved
              <Input
                name="carbonSaved"
                value={form.carbonSaved}
                onChange={updateForm}
                placeholder="500 tons CO2e"
              />
            </Field>

            <Field>
              Location
              <Input
                name="location"
                value={form.location}
                onChange={updateForm}
                placeholder="Hyderabad, Telangana"
              />
            </Field>

            <Field>
              Admin Organization
              <Input
                name="admin"
                value={form.admin}
                onChange={updateForm}
                placeholder="ReCircle Admin"
              />
            </Field>

            {message && <Message $kind={message.kind}>{message.text}</Message>}

            <FormActions>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Supply Chain'}
              </Button>
              <OutlineButton type="button" onClick={() => setForm(emptyForm)} disabled={isSubmitting}>
                Clear
              </OutlineButton>
            </FormActions>
          </Form>
        )}
      </InfoBox>
    </PageContainer>
  );
};

export default SupplyChainsPage;
