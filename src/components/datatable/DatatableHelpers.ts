export const GetDatatableItems = (state) => {
  return Object.keys(state.rows.idRowsLookup).reduce(
    (prev, key) => {
      const member = state.rows.idRowsLookup[key];
      if (!member?.locked) {
        prev.newItems = [...prev.newItems, member];
      }

      prev.allItems = [...prev.allItems, member];

      return prev;
    },
    {
      newItems: [],
      allItems: []
    }
  );
};

export const GetDatatableChangedItems = (allItems, initialData) => {
  return initialData.reduce(
    (prev, curr) => {
      const item = allItems.find((i) => i.id === curr.id);

      if (!item) {
        prev.removedItems = [...prev.removedItems, curr];
      } else if (JSON.stringify(item) !== JSON.stringify(curr)) {
        prev.updatedItems = [...prev.updatedItems, curr];
      } else {
        prev.noChangedItems = [...prev.noChangedItems, curr];
      }

      return prev;
    },
    {
      removedItems: [],
      updatedItems: [],
      noChangedItems: []
    }
  );
};

export const LockDatatableItems = (items) => {
  return items.map((member, index) => {
    return {
      ...member,
      id: index,
      locked: true
    };
  });
};
