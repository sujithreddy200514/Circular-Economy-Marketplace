import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageTitle from '../components/common/PageTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import api from '../utils/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing(3)};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.background.paper};
`;

const Cell = styled.td`
  padding: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Head = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AdminPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);

  const load = async () => {
    const [summaryResponse, listingResponse] = await Promise.all([
      api.get('/api/admin/summary'),
      api.get('/api/listings')
    ]);
    setSummary(summaryResponse.data.summary);
    setListings(listingResponse.data.listings || []);
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const moderate = async (id: number, status: 'active' | 'rejected') => {
    await api.put(`/api/admin/listings/${id}/moderate`, { status });
    await load();
  };

  return (
    <PageContainer>
      <PageTitle subtitle="Moderation, wallet/COD activity, and environmental impact analytics">
        Admin Dashboard
      </PageTitle>

      <StatsGrid>
        <StatCard><StatLabel>Users</StatLabel><StatValue>{summary?.users || 0}</StatValue></StatCard>
        <StatCard><StatLabel>Active Listings</StatLabel><StatValue>{summary?.activeListings || 0}</StatValue></StatCard>
        <StatCard><StatLabel>Pending Listings</StatLabel><StatValue>{summary?.pendingListings || 0}</StatValue></StatCard>
        <StatCard><StatLabel>Transactions</StatLabel><StatValue>{summary?.transactions || 0}</StatValue></StatCard>
        <StatCard><StatLabel>Wallet Volume</StatLabel><StatValue>INR {summary?.walletVolume || 0}</StatValue></StatCard>
        <StatCard><StatLabel>COD Orders</StatLabel><StatValue>{summary?.codOrders || 0}</StatValue></StatCard>
        <StatCard><StatLabel>CO2 Saved</StatLabel><StatValue>{summary?.impact?.co2SavedKg || 0} kg</StatValue></StatCard>
        <StatCard><StatLabel>Waste Reduced</StatLabel><StatValue>{summary?.impact?.wasteReducedKg || 0} kg</StatValue></StatCard>
      </StatsGrid>

      <Card>
        <Table>
          <thead>
            <tr>
              <Head>Listing</Head>
              <Head>Type</Head>
              <Head>Status</Head>
              <Head>Seller</Head>
              <Head>Actions</Head>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <Cell>{listing.title}</Cell>
                <Cell>{listing.listingType}</Cell>
                <Cell>{listing.status}</Cell>
                <Cell>{listing.sellerName}</Cell>
                <Cell>
                  <Button size="small" variant="success" onClick={() => moderate(listing.id, 'active')}>
                    Approve
                  </Button>{' '}
                  <Button size="small" variant="error" onClick={() => moderate(listing.id, 'rejected')}>
                    Reject
                  </Button>
                </Cell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </PageContainer>
  );
};

export default AdminPage;
