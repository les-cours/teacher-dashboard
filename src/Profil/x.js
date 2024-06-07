const { error, loading, data } = useQuery(LOAD_CITIES);
  const [cityOptions, setCityOptions] = useState([]);
  const [signupTeacher] = useMutation(SIGNUP_TEACHER);

  useEffect(() => {
    if (data) {
      const options = data.cities.map((city) => ({
        value: city.id,
        label: city.name_ar,
      }));
      setCityOptions(options);
    }
  }, [data]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    gender: "",
    city: 0,
    avatar:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      city: selectedOption ? selectedOption.value : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signupTeacher({
        variables: {
          teacherID: teacherID,
          firstname: formData.firstName,
          lastname: formData.lastName,
          dateOfBirth: formData.birthDate,
          gender: formData.gender,
          cityID: formData.city,
          description: "",
          avatar:""
        },
      });
      
    } catch (error) {
      console.error("Error signing up teacher:", error);
    }
  };
  if (loading) return <p>جاري ...</p>;
  if (error) return <p>خطا في تحميل المدن</p>;