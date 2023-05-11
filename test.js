let users = [
  {
    id: "6efqadds247",
    username: "miguel",
    email: "miguel@gmail.com",
    status: "Inactive",
    blocked: false,
  },
  {
    id: "6efqadds245",
    username: "dasturchioka",
    email: "dasturchioka@gmail.com",
    status: "Active",
    blocked: false,
  },
  {
    id: "6efqadds246",
    username: "vapaevsad",
    email: "vapaevsad@gmail.com",
    status: "Inactive",
    blocked: true,
  },
];

const sorted = users.sort((a, b) => {
  if (a.status < b.status) {
    return -1;
  }

  if (a.status > b.status) {
    return 1;
  }
});

console.log(sorted);
