import ClayCard from '@clayui/card';
import ClayLayout from '@clayui/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';

import Header from '@/components/header';
import Meta from '@/components/meta';
import Panel from '@/components/panel';
import WrappedSafeComponent from '@/components/WrappedSafeComponent';
import { knowledgeSkillBySlug } from '@/graphql/queries';
import useLang from '@/hooks/useLang';
import { Github } from '@/types';
import { COLORS } from '@/utils/constans';
import ROUTES from '@/utils/routes';

interface ISkillDetailMentorsPanelProps
  extends React.HTMLAttributes<HTMLElement> {
  area: {
    name: string;
  };
  mentoringMembers: {
    github: Github;
  }[];
}

const SkillDetailMentorsPanel: React.FC<ISkillDetailMentorsPanelProps> = ({
  area,
  mentoringMembers,
}) => {
  const i18n = useLang();

  return (
    <Panel displayType="unstyled" title={i18n.get('mentors')}>
      {!!mentoringMembers.length &&
        mentoringMembers.map(({ github }) => (
          <ClayLayout.Col key={github.id} size={3}>
            <ClayCard>
              <img
                width="100%"
                height="100%"
                src={github.avatar_url}
                alt={github.name}
              />
              <ClayCard.Body>
                <ClayCard.Row>
                  <div className="autofit-col autofit-col-expand">
                    <section className="autofit-section">
                      <ClayCard.Description displayType="title">
                        <Link href={`${ROUTES.PROFILE}/${github.login}`}>
                          {github.name}
                        </Link>
                      </ClayCard.Description>
                      <ClayCard.Description displayType="subtitle">
                        {area.name}
                      </ClayCard.Description>
                    </section>
                  </div>
                </ClayCard.Row>
              </ClayCard.Body>
            </ClayCard>
          </ClayLayout.Col>
        ))}
    </Panel>
  );
};

interface ISkillDetailSummaryProps extends React.HTMLAttributes<HTMLElement> {
  summary: {
    columns: string | number[];
    type: string;
  };
}

const SkillDetailSummay: React.FC<ISkillDetailSummaryProps> = ({ summary }) => {
  const i18n = useLang();
  const data = [
    {
      name: 'Beginner',
      value: 2400,
    },
    {
      name: 'Apprentice',
      value: 4567,
    },
    {
      name: 'Praticioner',
      value: 1398,
    },
    {
      name: 'Professional',
      value: 9800,
    },
    {
      name: 'Teacher',
      value: 3908,
    },
    {
      name: 'Leader',
      value: 4800,
    },
    {
      name: 'Master',
      value: 1000,
    },
    {
      name: 'With Knowledge Gap',
      value: 2400,
    },
  ];

  return (
    <Panel displayType="unstyled" title={i18n.get('summary')}>
      <PieChart className="summary-chart" width={420} height={280}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend
          align="right"
          iconSize={16}
          formatter={(value) => <span className="legend-text">{value}</span>}
          iconType="square"
          layout="vertical"
          verticalAlign="middle"
        />
      </PieChart>
    </Panel>
  );
};

const SkillDetail = ({
  area,
  mentoringMembers,
  name,
  otherMembers,
  summary,
}) => {
  const i18n = useLang();
  const totalMembers = mentoringMembers.length + otherMembers.length;

  return (
    <>
      <Meta title={`${i18n.get('knowledge-detail')} - ${i18n.get(name)}`} />

      <Header centralized>
        <Header.Title>{name}</Header.Title>
        <Header.Info>
          {i18n.sub(
            totalMembers > 1 ? 'x-members' : 'x-member',
            String(totalMembers),
          )}
        </Header.Info>
        <Header.Info>{area.name}</Header.Info>
      </Header>

      <ClayLayout.ContainerFluid size="lg">
        <ClayLayout.Row className="mt-4">
          <ClayLayout.Col size={12}>
            <ClayCard className="p-4">
              <SkillDetailMentorsPanel
                area={area}
                mentoringMembers={mentoringMembers}
              />

              <SkillDetailSummay summary={summary} />
            </ClayCard>
          </ClayLayout.Col>
        </ClayLayout.Row>
      </ClayLayout.ContainerFluid>
    </>
  );
};

const SkillDetailWrapper: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
  const {
    query: { slug },
  } = useRouter();

  return (
    <WrappedSafeComponent
      query={knowledgeSkillBySlug}
      options={{ variables: { slug } }}
    >
      {({ getKnowledgeSkillBySlug }) => (
        <SkillDetail {...getKnowledgeSkillBySlug} />
      )}
    </WrappedSafeComponent>
  );
};

export default SkillDetailWrapper;
