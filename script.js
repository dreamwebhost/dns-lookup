// Original project
// https://codepen.io/umarcbs/pen/QWEbWLx
const records = ["A", "AAAA", "CAA", "CNAME", "MX", "NS", "TXT", "SRV"];

const dnsFetch = async (type, target) => {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${target}&type=${type}`, {
    headers: {
      Accept: "application/dns-json",
    },
  });
  if (!res.ok) {
    throw res;
  }
  const i = await res.json();
  return i.Answer ? i.Answer : [];
}

const dnsRecords = async target => {
  const results = {};
  const promises = [];
  records.forEach(type => {
    const promise = dnsFetch(type, target).then(response => {
      results[type] = response;
    }).catch(err => {
      console.error(err);
      results[type] = [];
    });
    promises.push(promise);
  });
  await Promise.all(promises);
  return results;
}

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const target = document.getElementById("input").value;
  dnsRecords(target).then(data => {
    document.getElementById("data").textContent = JSON.stringify(data, null, 2);
  });
});