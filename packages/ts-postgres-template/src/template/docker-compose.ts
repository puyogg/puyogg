import * as yaml from 'yaml';

interface DockerCompose {
  version: string;
  services: Record<
    string,
    {
      image?: string;
      ports?: string[];
      environment?: Record<string, string>;
      volumes?: string[];
    }
  >;
  volumes: Record<string, null>;
}

export const generateDockerComposeYaml = ({
  packageName,
  originalYaml,
}: {
  packageName: string;
  originalYaml: string;
}): string => {
  const dockerComposeBase = yaml.parse(originalYaml) as DockerCompose;

  const allHostPorts = new Set<number>(
    Object.entries(dockerComposeBase.services)
      .flatMap(([, service]) => {
        const ports = service.ports;
        if (!ports) return;

        const hostPorts = ports.map((portMap) => {
          const [host] = portMap.split(':');
          return parseInt(host, 10);
        });

        return hostPorts;
      })
      .filter((v): v is number => typeof v === 'number'),
  );

  let newPostgresPort: number;
  {
    let found = false;
    let i = 35432;
    while (!found) {
      if (!allHostPorts.has(i)) {
        found = true;
      } else {
        i++;
      }
    }

    newPostgresPort = i;
  }

  const templateDbService = dockerComposeBase.services['ts-postgres-template'];
  const volumeName = `${packageName}-volume`;

  const newDockerService: DockerCompose['services'][keyof DockerCompose['services']] = {
    image: templateDbService.image,
    ports: [`${newPostgresPort}:5432`],
    environment: structuredClone(templateDbService.environment),
    volumes: [`${volumeName}:/var/lib/postgresql/data`],
  };

  const newDockerTestService: DockerCompose['services'][keyof DockerCompose['services']] = {
    image: templateDbService.image,
    ports: [`${newPostgresPort}:5432`],
    environment: structuredClone(templateDbService.environment),
  };

  dockerComposeBase.services[packageName] = newDockerService;
  dockerComposeBase.services[`${packageName}-test`] = newDockerTestService;
  dockerComposeBase.volumes[volumeName] = null;
  return yaml.stringify(dockerComposeBase, { nullStr: '' });
};
