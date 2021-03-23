import { useCallback, useContext, useState } from 'react';

import useLang from '@/hooks/useLang';

import SkillContext from './SkillContext';

const DEFAULT_PAGE_SIZE = 9;

const useSkillManagement = () => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedTab, setSelectedTab] = useState('all');
  const i18n = useLang();

  const {
    state: { knowledgeArea, knowledgeSkills, search, selectedSkills },
  } = useContext(SkillContext);

  const handleClickTab = (tab: { id: string }) => {
    setSelectedTab(tab.id);
    setPageSize(DEFAULT_PAGE_SIZE);
  };

  const getKnowledgeSkills = useCallback(() => {
    let skills = [];
    if (selectedTab === 'all') {
      skills = knowledgeSkills;
    } else {
      skills = knowledgeArea
        .filter(({ id }) => selectedTab === id)
        .map(({ skills }) => skills)
        .flat();
    }

    const filteredSkills = skills
      .filter(
        ({ id }) =>
          !selectedSkills.find((selected) => selected.knowledgeSkillId === id),
      )
      .filter((skill) =>
        skill.name.toLowerCase().includes(search.toLocaleLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const paginatedSkills = filteredSkills.slice(0, pageSize);

    return [filteredSkills, paginatedSkills];
  }, [
    knowledgeArea,
    knowledgeSkills,
    selectedTab,
    selectedSkills,
    search,
    pageSize,
  ]);

  const [filteredSkills, paginatedSkills] = getKnowledgeSkills();

  const tabs = [
    { id: 'all', label: i18n.sub('all-x', knowledgeSkills.length.toString()) },
    ...knowledgeArea.map((area) => ({ id: area.id, label: area.name })),
  ];

  return {
    fns: {
      handleClickTab,
      setPageSize,
    },
    state: {
      DEFAULT_PAGE_SIZE,
      filteredSkills,
      pageSize,
      paginatedSkills,
      tabs,
    },
  };
};

export default useSkillManagement;