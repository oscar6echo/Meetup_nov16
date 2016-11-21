np.random.seed(9875432)

Nb_path = 5     # nb of monte carlo paths
rate = 0.02     # rate 0.01=1%
vol = 0.25      # vol 0.25
Nb_bd = 600     # nb of bdays for a path
dt = 1.0/260    # bday duration in year

returns = (rate-vol**2/2)*dt+vol*np.sqrt(dt)*np.random.normal(size=(Nb_bd, Nb_path))
yields = (1.0+returns)
tracks = yields.cumprod(axis=0)

dates = pd.date_range(start=pd.Timestamp('2016-11-26'), periods=Nb_bd, freq='B')
df = pd.DataFrame(data=tracks, index=dates, columns=['track'+str(1+i) for i in range(Nb_path)])

display(df.head(3))
display(df.tail(3))