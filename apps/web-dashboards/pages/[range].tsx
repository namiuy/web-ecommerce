import type { GetServerSideProps } from 'next';
import { DashboardView } from './index';
import { buildProps } from '../lib/props';

// Rango por ruta (/robotec/dashboards/today) en vez de query — el proxy rutea /prefijo/* sin problema.
export const getServerSideProps: GetServerSideProps = async (ctx) => buildProps(ctx.params?.range as string);

export default DashboardView;
