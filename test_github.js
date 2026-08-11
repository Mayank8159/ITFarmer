

async function run() {
  const GITHUB_USERS = ['Mayank8159', 'priyanshu-ogdev', 'MURPHIOP'];
  const promises = GITHUB_USERS.map(user => 
    fetch(`https://api.github.com/users/${user}/events/public`).then(async res => {
      console.log(user, res.status);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    })
  );

  const results = await Promise.all(promises);
  console.log("Is array?", Array.isArray(results[0]));
  if (Array.isArray(results[0]) && results[0].length > 0) {
    console.log("First event:", results[0][0]);
  } else {
    console.log("Content:", results[0]);
  }
}

run();
