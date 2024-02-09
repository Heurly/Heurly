type ApiFilter<T> = {
    equals?: T;
    greater?: T;
    lower?: T;
    in?: T[];
  };
  
  export default ApiFilter;