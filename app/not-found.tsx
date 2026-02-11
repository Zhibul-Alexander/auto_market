import Link from 'next/link';
import { Container, Card, CardBody, H2, P, Button } from '../components/ui';

export default function NotFound() {
  return (
    <Container style={{ paddingTop: 40, paddingBottom: 60 }}>
      <Card>
        <CardBody>
          <H2>Not found</H2>
          <P style={{ marginTop: 10 }}>This page does not exist.</P>
          <div style={{ height: 14 }} />
          <Link href="/en">
            <Button $variant="primary">Go home</Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}
