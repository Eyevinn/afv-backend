import api from './api';
import { K8S } from './container_service/k8s';

async function main() {
  const containerService = new K8S(process.env.KUBECONFIG_FILE);
  await containerService.initService();

  let slackWebHookUrl;
  if (process.env.SLACK_WEBHOOK_URL) {
    slackWebHookUrl = new URL(process.env.SLACK_WEBHOOK_URL);
  }
  const server = api({
    service: containerService,
    slackWebHookUrl: slackWebHookUrl
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Server listening on ${address}`);
  });
}

export default main();