export let profileAsync = async (desc, func) => {
  
    console.time(desc);

    let r = await func();

    console.timeEnd(desc);

    return r;

}