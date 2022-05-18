[Back to Websites](/src/support.documentation/websites)

# Session Storage

The websites service can be configured to store sessions with one of three mechanisms:

*   In memory
*   Filesystem
*   SQL

Configuration of these settings can be found within the Websites section, in the Sessions area:

![image](https://i.postimg.cc/nc7kGvCB/Screenshot-2020-06-27-Screenshot-1.png)

Any [Sequalize supported dialect](https://sequelize.org/v5/manual/dialects.html) can be configured as a data source.

The [secrets store](/src/support.documentation/secrets) can be used to hold these connection strings.