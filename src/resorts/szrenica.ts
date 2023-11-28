import xpath from 'xpath';
import { DOMParser } from 'xmldom';

async function szrenica() {
  try {
    const url = 'https://szrenicaskiarena.pl/koleje-i-wyciagi/';

    // Fetch HTML content from the URL
    const response = await fetch(url);
    const html = await response.text();
    console.log(html);

    // Parse the HTML content
    const doc = new DOMParser().parseFromString(html);

    // Perform XPath selection
    const nodes = xpath.select('/html/body/div[4]/div[2]/div/div/div/div/article/div/div/section[1]/div/div[2]/div/section[1]/div/div[2]/div/div/div/div/div', doc);
    // console.log('tutaj:', nodes);

    // Process the nodes
    // nodes!.forEach(function (node: any) {
    //   console.log(node.toString());
    // });
  } catch (error) {
    console.error('Error fetching or parsing:', error);
  }
}

export default szrenica;
